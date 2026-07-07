import { NextResponse } from "next/server";
import { OAuthService } from "../../../../../../server/oauth.service";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ provider: string }> }
) {
  try {
    const { provider } = await params;
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const errorParam = url.searchParams.get("error");

    if (errorParam) {
      return NextResponse.json({ error: `Provider returned error: ${errorParam}` }, { status: 400 });
    }

    if (!code || !state) {
      return NextResponse.json({ error: "Missing code or state parameter" }, { status: 400 });
    }

    await OAuthService.exchangeCodeAndSave(provider, code, state);

    // Redirect to a success page or return JSON
    return NextResponse.json({ success: true, message: `Successfully connected to ${provider}` });
  } catch (error: any) {
    console.error("OAuth Callback Error:", error);
    return NextResponse.json({ error: error.message || "Failed to complete OAuth flow" }, { status: 400 });
  }
}
