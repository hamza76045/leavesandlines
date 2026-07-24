import { NextResponse } from "next/server";
import { createAdminSession, getAdminCredentials } from "@/lib/auth/admin";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const credentials = getAdminCredentials();

    if (
      email?.trim().toLowerCase() === credentials.email.toLowerCase() &&
      password === credentials.password
    ) {
      await createAdminSession();
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "Invalid admin email or password" },
      { status: 401 }
    );
  } catch {
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}
