import { lucia } from "@/lib/auth";
import type { Context } from "@/lib/context";
import { loginRouter } from "@/v1/auth/routes/login";
import { logoutRouter } from "@/v1/auth/routes/logout";
import { signupRouter } from "@/v1/auth/routes/signup";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { verifyRequestOrigin } from "lucia";

const app = new Hono<Context>();

app.use("*", async (c, next) => {
  if (c.req.method === "GET") {
    return next();
  }

  const originHeader = c.req.header("Origin") ?? null;
  const hostHeader = c.req.header("Host") ?? null;

  if (
    !originHeader ||
    !hostHeader ||
    !verifyRequestOrigin(originHeader, [hostHeader])
  ) {
    return c.body(null, 403);
  }

  return next();
});

app.use("*", async (c, next) => {
  const sessionId = lucia.readSessionCookie(c.req.header("Cookie") ?? "");
  if (!sessionId) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }

  const { session, user } = await lucia.validateSession(sessionId);
  if (session && session.fresh) {
    c.header("Set-Cookie", lucia.createSessionCookie(session.id).serialize(), {
      append: true,
    });
  }

  if (!session) {
    c.header("Set-Cookie", lucia.createBlankSessionCookie().serialize(), {
      append: true,
    });
  }

  c.set("session", session);
  c.set("user", user);

  return next();
});

app.route("/", loginRouter).route("/", signupRouter).route("/", logoutRouter);

serve({
  fetch: app.fetch,
  port: 8080,
});

console.log("Server running on port 8080");
