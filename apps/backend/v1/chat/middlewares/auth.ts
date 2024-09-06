import { auth } from "@/lib/auth";
import { NextFunction, Request, Response } from "express";

export function authenticate() {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = await auth(req.session);

    if (!user.success) {
      return res.json(user.error).status(401);
    }

    req.user = user.data;

    return next();
  };
}
