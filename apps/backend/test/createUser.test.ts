import { prisma } from "@/lib/__mocks__/prisma";
import { Prisma } from "@repo/db";
import { expect, test, vi } from "vitest";

vi.mock("../lib/prisma");

// Pretend this is a function imported from elsewhere
export const createUser = async (user: Prisma.UserCreateInput) => {
  return await prisma.user.create({
    data: user,
  });
};

test("createUser should return the generated user", async () => {
  const newUser = {
    email: "user@prisma.io",
    name: "Prisma Fan",
    password: "123456",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  prisma.user.create.mockResolvedValue({ ...newUser, id: "1" });
  const user = await createUser(newUser);
  expect(user).toStrictEqual({ ...newUser, id: "1" });
});
