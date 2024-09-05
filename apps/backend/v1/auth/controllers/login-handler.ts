import { prisma } from "@/lib/prisma";
import argon2 from "argon2";
import { Request, Response } from "express";

export async function loginHandler(req: Request, res: Response) {
  const credentials = req.body;

  const user = await prisma.user.findUnique({
    where: { email: credentials.email },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
    },
  });

  if (!user) {
    return res.json({ message: "User not found" }).status(404);
  }

  await argon2.verify(user.password, credentials.password).catch();

  req.session.userId = String(user.id);

  const userData = {
    id: user.id,
    name: user.name,
    email: user.email,
  };

  return res.json(userData).status(200);
}
