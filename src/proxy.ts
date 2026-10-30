import { NextResponse, type NextRequest } from "next/server";
import { isAuthorized } from "@/lib/auth";

export function proxy(request: NextRequest) {
  const password = process.env.SITE_PASSWORD;
  // Fail closed: a missing env var must never expose the site.
  if (!password) {
    return new NextResponse("SITE_PASSWORD is not set", { status: 500 });
  }

  if (isAuthorized(request.headers.get("authorization"), password)) {
    return NextResponse.next();
  }

  return new NextResponse("Password required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Etsy PM Lab prototype"' },
  });
}

export const config = {
  // Everything except Next's own build assets. Listing photos in /public are gated too.
  matcher: ["/((?!_next/static).*)"],
};
