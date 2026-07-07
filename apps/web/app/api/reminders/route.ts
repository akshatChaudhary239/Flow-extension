import { NextResponse } from "next/server";
import { prisma } from "../../../infrastructure/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: { email: "test@example.com", hashedPassword: "dummy" }
      });
    }

    const reminder = await prisma.reminder.create({
      data: {
        userId: user.id,
        title: body.title,
        time: new Date(body.time),
      }
    });

    return NextResponse.json({ success: true, reminder });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create reminder" }, { status: 500 });
  }
}
