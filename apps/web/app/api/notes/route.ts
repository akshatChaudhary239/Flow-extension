import { NextResponse } from "next/server";
import { prisma } from "../../../infrastructure/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({ data: { email: "test@example.com", hashedPassword: "dummy" }});
    }

    const note = await prisma.note.create({
      data: {
        userId: user.id,
        content: body.content,
        sourceUrl: body.sourceUrl,
      }
    });

    return NextResponse.json({ success: true, note });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create note" }, { status: 500 });
  }
}
