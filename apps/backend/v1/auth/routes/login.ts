import { lucia } from "@/lib/auth";
import type { Context } from "@/lib/context";
import { prisma } from "@/lib/prisma";
import { verify } from "@node-rs/argon2";
import { Hono } from "hono";
import { z } from "zod";

export const loginRouter = new Hono<Context>().basePath("/v1/auth");

loginRouter.get("/login", async (c) => {
  const session = c.get("session");
  if (session) {
    return c.redirect("/");
  }

  return c.json({ message: "User logged in successfully" }, 200);
});

loginRouter.post("/login", async (c) => {
  const body = await c.req.parseBody<{
    email: string;
    password: string;
  }>();

  const email: string | null = body.email ?? null;

  if (
    !email ||
    email.length < 3 ||
    email.length > 31 ||
    z.string().email().safeParse(email).success === false
  ) {
    return c.json({ message: "Invalid password" }, 400);
  }

  const password: string | null = body.password ?? null;

  if (!password || password.length < 6 || password.length > 255) {
    return c.json({ message: "Invalid password" }, 400);
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: email },
  });

  if (!existingUser) {
    return c.json({ message: "Incorrect email or password" }, 400);
  }

  const validPassword = await verify(existingUser.password, password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  if (!validPassword) {
    // NOTE:
    // Returning immediately allows malicious actors to figure out valid usernames from response times,
    // allowing them to only focus on guessing passwords in brute-force attacks.
    // As a preventive measure, you may want to hash passwords even for invalid usernames.
    // However, valid usernames can be already be revealed with the signup page among other methods.
    // It will also be much more resource intensive.
    // Since protecting against this is non-trivial,
    // it is crucial your implementation is protected against brute-force attacks with login throttling, 2FA, etc.
    // If usernames are public, you can outright tell the user that the username is invalid.
    return c.json({ message: "Incorrect email or password" }, 400);
  }

  const session = await lucia.createSession(existingUser.id, {});

  c.header("Set-Cookie", lucia.createSessionCookie(session.id).serialize(), {
    append: true,
  });

  c.header("Location", "/", { append: true });

  return c.redirect("/");
});
