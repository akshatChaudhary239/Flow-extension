import { NextResponse } from "next/server";
import { AuthService } from "../../../../server/auth.service";
import { loginSchema } from "../../../../domain/schemas";
import { z } from "zod";
import { cookies } from "next/headers";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = loginSchema.parse(body);

    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";
    
    const ipHash = crypto.createHash("sha256").update(ip).digest("hex");

    const session = await AuthService.login(data.email, data.password, data.rememberMe || false, ipHash, userAgent);

    const cookieStore = await cookies();
    cookieStore.set({
      name: "flow_session",
      value: session.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: session.expiresAt,
      path: "/",
    });

    return NextResponse.json({ success: true, token: session.token });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: { code: "VALIDATION_ERROR", message: (error as any).errors[0].message } }, { status: 400 });
    }
    
    // Using generic error for invalid credentials
    return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Invalid email or password" } }, { status: 401 });
  }
}
