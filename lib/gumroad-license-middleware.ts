import { NextResponse, type NextRequest } from "next/server";
import {
  hasLicenseCookie,
  isGumroadLicenseGateEnabled,
  LICENSE_COOKIE_NAME,
  pathRequiresLicense,
} from "@/lib/gumroad-license";

const UNLOCK_PATH = "/unlock";

export function licenseGateResponse(
  request: NextRequest,
): NextResponse | null {
  if (!isGumroadLicenseGateEnabled()) return null;

  const { pathname } = request.nextUrl;
  if (pathname === UNLOCK_PATH || pathname.startsWith(`${UNLOCK_PATH}/`)) {
    return null;
  }
  if (!pathRequiresLicense(pathname)) return null;

  const licensed = hasLicenseCookie(
    request.cookies.get(LICENSE_COOKIE_NAME)?.value,
  );
  if (licensed) return null;

  const url = request.nextUrl.clone();
  url.pathname = UNLOCK_PATH;
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}
