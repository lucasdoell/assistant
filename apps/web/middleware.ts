import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const AUTH_ROUTES = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  const cookie = request.cookies.get("auth_session")?.value;

  if (AUTH_ROUTES.includes(request.nextUrl.pathname)) {
    if (cookie) {
      return NextResponse.redirect(new URL("/chat", request.url));
    }

    return null;
  }
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
