import { NextResponse } from "next/server";
import { OAuthService } from "../../../../../../server/oauth.service";
import { prisma } from "../../../../../../infrastructure/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ provider: string }> }
) {
  try {
    const { provider } = await params;
    
    // For now, since we don't have the frontend session hooked up in this route,
    // we will associate it with the first test user or create one.
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({ data: { email: "test@example.com", hashedPassword: "dummy" }});
    }

    const authUrl = OAuthService.getAuthUrl(provider, user.id);

    // Redirect the user to the provider's OAuth consent screen
    return NextResponse.redirect(authUrl);
  } catch (error: any) {
    console.error("OAuth Connect Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate auth URL" }, { status: 400 });
  }
}
