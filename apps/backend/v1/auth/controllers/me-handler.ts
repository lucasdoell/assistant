import { prisma } from "@/lib/prisma";
import { Request, Response } from "express";

export async function meHandler(req: Request, res: Response) {
  const session = req.session;
  const sessionId = session.userId;

  if (!sessionId) {
    return res.json({ message: "User already logged out." }).status(400);
  }

  const remainingTime = session.cookie.maxAge || 0;

  if (remainingTime <= 0) {
    return res.json({ message: "Session has expired." }).status(401);
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, name: true },
  });

  return res.json(user).status(200);
}
