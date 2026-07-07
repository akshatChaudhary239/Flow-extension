import { NextResponse } from "next/server";
import { prisma } from "../../../../infrastructure/prisma";
import { actionRouter } from "../../../../server/action-router.service";
import { ProviderCapability } from "../../../../domain/providers/types";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({ data: { email: "test@example.com", hashedPassword: "dummy" }});
    }

    // Determine mocked URLs
    const storageKey = `mock-s3-key/${Date.now()}-${body.filename}`;
    const url = `https://mock-r2.com/${Date.now()}-${body.filename}`;

    const result = await actionRouter.routeAction(
      user.id,
      ProviderCapability.UPLOAD_ATTACHMENT,
      {
        filename: body.filename,
        mimeType: body.mimeType,
        size: body.size,
        storageKey,
        url
      }
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error, metadata: result.metadata }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      uploadUrl: `https://mock-r2.com/upload?key=${storageKey}`, // dummy
      metadata: result.metadata
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate upload URL" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
