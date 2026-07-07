import { NextResponse } from "next/server";
import { prisma } from "../../../infrastructure/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({ data: { email: "test@example.com", hashedPassword: "dummy" }});
    }

    const connection = await prisma.connectionStatus.create({
      data: {
        userId: user.id,
        profileUrl: body.profileUrl,
        profileName: body.profileName,
        status: body.status,
        sourceRef: body.sourceRef,
      }
    });

    return NextResponse.json({ success: true, connection });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create connection status" }, { status: 500 });
  }
}
