import { prisma } from "@/lib/prisma";
import argon2 from "argon2";
import { Request, Response } from "express";

export async function signupHandler(req: Request, res: Response) {
  const userDetails = req.body;

  const hashedPasword = await argon2.hash(userDetails.password);

  const user = await prisma.user.create({
    data: {
      name: userDetails.name,
      email: userDetails.email,
      password: hashedPasword,
    },
    select: {
      id: true,
      email: true,
    },
  });

  req.session.userId = String(user.id);

  return res.json(user).status(200);
}
