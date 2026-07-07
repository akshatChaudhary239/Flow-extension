import { NextResponse } from "next/server";
import { prisma } from "../../../../infrastructure/prisma";
import { hashToken } from "../../../../domain/auth";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    let token = "";

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else {
      // Look for the cookie as fallback
      const cookieHeader = req.headers.get("cookie");
      if (cookieHeader) {
        const match = cookieHeader.match(/flow_session=([^;]+)/);
        if (match) token = match[1];
      }
    }

    if (!token) {
      return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "No session token provided" } }, { status: 401 });
    }

    const tokenHash = hashToken(token);
    
    const session = await prisma.session.findUnique({
      where: { tokenHash },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            emailVerifiedAt: true,
            createdAt: true,
            updatedAt: true,
          }
        }
      }
    });

    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Session expired or invalid" } }, { status: 401 });
    }

    return NextResponse.json({ success: true, session });
  } catch (error) {
    return NextResponse.json({ error: { code: "INTERNAL_ERROR", message: "Failed to validate session" } }, { status: 500 });
  }
}
