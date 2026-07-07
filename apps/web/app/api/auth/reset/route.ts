import { NextResponse } from "next/server";
import { AuthService } from "../../../../server/auth.service";
import { requestPasswordResetSchema, resetPasswordSchema } from "../../../../domain/schemas";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = requestPasswordResetSchema.parse(body);

    await AuthService.requestPasswordReset(data.email);

    return NextResponse.json({ success: true, message: "If that email exists, we have sent a password reset link." });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: { code: "VALIDATION_ERROR", message: (error as any).errors[0].message } }, { status: 400 });
    }
    return NextResponse.json({ error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" } }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const data = resetPasswordSchema.parse(body);

    await AuthService.resetPassword(data.token, data.newPassword);

    return NextResponse.json({ success: true, message: "Password reset successfully. You can now log in." });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: { code: "VALIDATION_ERROR", message: (error as any).errors[0].message } }, { status: 400 });
    }
    return NextResponse.json({ error: { code: "BAD_REQUEST", message: "Invalid or expired token" } }, { status: 400 });
  }
}
