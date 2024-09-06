import { Request, Response } from "express";

export function chatController(req: Request, res: Response) {
  return res
    .json({ message: `Hello from Chat, ${req.user?.name}!` })
    .status(200);
}
