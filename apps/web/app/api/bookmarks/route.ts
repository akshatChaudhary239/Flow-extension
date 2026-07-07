import { NextResponse } from "next/server";
import { prisma } from "../../../infrastructure/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({ data: { email: "test@example.com", hashedPassword: "dummy" }});
    }

    const bookmark = await prisma.bookmark.create({
      data: {
        userId: user.id,
        url: body.url,
        title: body.title,
        metadata: body.metadata,
      }
    });

    return NextResponse.json({ success: true, bookmark });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create bookmark" }, { status: 500 });
  }
}
