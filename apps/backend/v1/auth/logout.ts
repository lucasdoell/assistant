import { lucia } from "@/lib/auth";
import type { Context } from "@/lib/context";
import { Hono } from "hono";

export const logoutRouter = new Hono<Context>().basePath("/v1/auth");

logoutRouter.post("/logout", async (c) => {
  const session = c.get("session");
  if (!session) return c.body(null, 401);

  await lucia.invalidateSession(session.id);

  c.header("Set-Cookie", lucia.createBlankSessionCookie().serialize());

  return c.json({ message: "User logged out successfully" }, 200);
});
