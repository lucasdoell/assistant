import { cookies } from "next/headers";
import { z } from "zod";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
});

const LoginSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
});

export type User = z.infer<typeof UserSchema>;

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

/**
 * Fetches the authenticated user's data from the API.
 * @returns The authenticated user's data, or `null` if the request fails.
 */
export async function auth(): Promise<User | null> {
  const res = await fetch(`${BASE_URL}/v1/auth/user`, {
    headers: { Cookie: cookies().toString() },
    cache: "no-cache",
  });

  if (!res.ok) {
    console.error("Failed to fetch user:", res.statusText);
    throw new AuthenticationError("Failed to fetch user");
  }

  const body = UserSchema.safeParse(await res.json());
  if (!body.success) {
    console.error("Failed to parse user data:", body.error);
    return null;
  }

  return body.data;
}

/**
 * Logs in the user with the provided email and password.
 * @param email - The email address of the user.
 * @param password - The password of the user.
 * @returns The authenticated user's data, or `null` if the login fails.
 * @throws {AuthenticationError} If the login request fails or the response data does not match the expected schema.
 */
export async function login(
  email: string,
  password: string,
): Promise<User | null> {
  const res = await fetch(`${BASE_URL}/v1/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    cache: "no-cache",
  });

  if (!res.ok) {
    console.error("Failed to login:", res.statusText);
    throw new AuthenticationError("Failed to login");
  }

  const body = LoginSchema.safeParse(await res.json());
  if (!body.success) {
    console.error("Failed to parse login data:", body.error);
    throw new AuthenticationError("Login data does not match schema");
  }

  return body.data;
}

/**
 * Logs out the authenticated user by removing the authentication cookie and reloading the page.
 * This function is typically called when the user explicitly requests to log out of the application.
 */
export async function logout() {
  const res = await fetch(`${BASE_URL}/v1/auth/logout`, {
    method: "POST",
    cache: "no-cache",
  });

  if (!res.ok) {
    console.error("Failed to log out:", res.statusText);
    throw new AuthenticationError("Failed to log out");
  }

  cookies().delete("luxAuth");
}
