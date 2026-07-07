import { NextResponse } from "next/server";
import { AuthService } from "../../../../../server/auth.service";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: { code: "BAD_REQUEST", message: "Token is required" } }, { status: 400 });
  }

  try {
    await AuthService.verifyEmail(token);
    // In a real application, you'd redirect to a success page
    // return NextResponse.redirect(new URL("/login?verified=true", req.url));
    return NextResponse.json({ success: true, message: "Email verified successfully." });
  } catch (error: any) {
    return NextResponse.json({ error: { code: "BAD_REQUEST", message: "Invalid or expired token" } }, { status: 400 });
  }
}
