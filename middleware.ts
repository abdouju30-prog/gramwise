import { type NextRequest } from "next/server";
import { licenseGateResponse } from "@/lib/gumroad-license-middleware";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const licenseRedirect = licenseGateResponse(request);
  if (licenseRedirect) return licenseRedirect;
  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
