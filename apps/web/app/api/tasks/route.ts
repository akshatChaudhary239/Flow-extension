import { NextResponse } from "next/server";
import { prisma } from "../../../infrastructure/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // For Phase 1 testing, we'll associate with the first user in the DB,
    // or create a dummy user if none exists.
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: { email: "test@example.com", hashedPassword: "dummy" }
      });
    }

    const task = await prisma.task.create({
      data: {
        userId: user.id,
        title: body.title,
        description: body.description,
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        sourceUrl: body.sourceUrl,
      }
    });

    return NextResponse.json({ success: true, task });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}
