import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { User } from "@repo/db";
import { Lucia } from "lucia";

const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      id: attributes.id,
      name: attributes.name,
      email: attributes.email,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: User;
  }
}
