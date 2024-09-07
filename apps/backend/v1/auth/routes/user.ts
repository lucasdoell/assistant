import { Context } from "@/lib/context";
import { prisma } from "@/lib/prisma";
import { Hono } from "hono";

export const userRouter = new Hono<Context>().basePath("/v1/auth");

userRouter.get("/user", async (c) => {
  const session = c.get("session");
  if (!session) return c.json({ message: "User not found" }, 404);

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, name: true },
  });

  if (!user) return c.json({ message: "User not found" }, 404);

  return c.json(user);
});
