import { NextResponse } from "next/server";
import { AuthService } from "../../../../server/auth.service";
import { registerSchema } from "../../../../domain/schemas";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = registerSchema.parse(body);

    await AuthService.register(data.email, data.password);

    return NextResponse.json({ success: true, message: "Registration successful. Please check your email to verify your account." });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: { code: "VALIDATION_ERROR", message: (error as any).errors[0].message } }, { status: 400 });
    }
    return NextResponse.json({ error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" } }, { status: 500 });
  }
}
