import { lucia } from "@/lib/auth";
import type { Context } from "@/lib/context";
import { prisma } from "@/lib/prisma";
import { hash } from "@node-rs/argon2";
import { Prisma } from "@repo/db";
import { Hono } from "hono";
import { generateId } from "lucia";
import { z } from "zod";

export const signupRouter = new Hono<Context>().basePath("/v1/auth");

signupRouter.get("/signup", async (c) => {
  const session = c.get("session");
  if (session) return c.redirect("/");

  return c.json({ message: "User already signed up" }, 200);
});

signupRouter.post("/signup", async (c) => {
  const body = await c.req.json();

  const email: string | null = body.email ?? null;

  if (!email || z.string().email().safeParse(email).success === false) {
    return c.json({ message: "Invalid password" }, 400);
  }

  const password: string | null = body.password ?? null;

  if (!password || password.length < 6 || password.length > 255) {
    return c.json({ message: "Invalid password" }, 400);
  }

  const passwordHash = await hash(password, {
    // recommended minimum parameters
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  const userId = generateId(15);

  try {
    await prisma.user.create({
      data: {
        id: userId,
        email: email,
        password: passwordHash,
      },
    });

    const session = await lucia.createSession(userId, {});

    c.header("Set-Cookie", lucia.createSessionCookie(session.id).serialize(), {
      append: true,
    });

    return c.json({ message: "User created successfully" }, 200);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return c.json({ message: "Email already used" }, 400);
      }
    }
    return c.json({ message: "An unknown error occurred" }, 500);
  }
});
