import { NextResponse } from "next/server";
import {
  isGumroadLicenseGateEnabled,
  LICENSE_COOKIE_NAME,
} from "@/lib/gumroad-license";
import { verifyGumroadLicenseKey } from "@/lib/gumroad-verify";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export async function POST(request: Request) {
  if (!isGumroadLicenseGateEnabled()) {
    return NextResponse.json(
      { error: "License verification is not configured." },
      { status: 503 },
    );
  }

  let licenseKey: string;
  try {
    const body = (await request.json()) as { license_key?: string };
    licenseKey = body.license_key?.trim() ?? "";
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!licenseKey) {
    return NextResponse.json({ error: "License key is required." }, { status: 400 });
  }

  const result = await verifyGumroadLicenseKey(licenseKey);
  if (!result.ok) {
    const status =
      result.code === "not_configured"
        ? 503
        : result.code === "upstream"
          ? 502
          : 401;
    return NextResponse.json({ error: "Invalid license key." }, { status });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(LICENSE_COOKIE_NAME, "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
  return response;
}
