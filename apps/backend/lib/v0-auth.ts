import { prisma } from "@/lib/prisma";
import { User } from "@repo/db";
import { SessionData } from "express-session";

type AuthResult =
  | {
      success: true;
      data: User;
    }
  | {
      success: false;
      error: string;
    };

export async function auth(session: SessionData): Promise<AuthResult> {
  let user: User | null;

  try {
    user = await prisma.user.findUnique({ where: { id: session.userId } });
  } catch (error) {
    console.log("Error fetching user:", error);
    return { success: false, error: "Internal server error" };
  }

  if (!user) return { success: false, error: "User not found" };

  return { success: true, data: user };
}
