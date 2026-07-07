import { prisma } from "../infrastructure/prisma";

const getAppUrl = () => process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export class OAuthService {
  /**
   * Generates the OAuth consent screen URL for the specified provider
   */
  static getAuthUrl(provider: string, userId: string): string {
    const appUrl = getAppUrl();
    
    switch (provider) {
      case "notion": {
        const clientId = process.env.NOTION_CLIENT_ID;
        const redirectUri = `${appUrl}/api/auth/providers/notion/callback`;
        // Encode state with userId
        const state = encodeURIComponent(JSON.stringify({ userId }));
        return `https://api.notion.com/v1/oauth/authorize?client_id=${clientId}&response_type=code&owner=user&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;
      }
      
      case "google_tasks": {
        const clientId = process.env.GOOGLE_CLIENT_ID;
        const redirectUri = `${appUrl}/api/auth/providers/google_tasks/callback`;
        const scope = encodeURIComponent("https://www.googleapis.com/auth/tasks");
        const state = encodeURIComponent(JSON.stringify({ userId }));
        return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&response_type=code&scope=${scope}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&access_type=offline&prompt=consent`;
      }
      
      default:
        throw new Error(`Unsupported OAuth provider: ${provider}`);
    }
  }

  /**
   * Exchanges the authorization code for an access token and saves it securely in Prisma
   */
  static async exchangeCodeAndSave(provider: string, code: string, stateParam: string): Promise<void> {
    const appUrl = getAppUrl();
    
    // Decode state to get userId
    let userId: string;
    try {
      const stateObj = JSON.parse(decodeURIComponent(stateParam));
      userId = stateObj.userId;
      if (!userId) throw new Error("Missing userId in state");
    } catch (e) {
      throw new Error("Invalid state parameter");
    }

    switch (provider) {
      case "notion": {
        const clientId = process.env.NOTION_CLIENT_ID || "";
        const clientSecret = process.env.NOTION_CLIENT_SECRET || "";
        const redirectUri = `${appUrl}/api/auth/providers/notion/callback`;
        
        // Basic auth encoded token
        const encodedAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

        const response = await fetch("https://api.notion.com/v1/oauth/token", {
          method: "POST",
          headers: {
            "Authorization": `Basic ${encodedAuth}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            grant_type: "authorization_code",
            code,
            redirect_uri: redirectUri
          })
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Notion OAuth failed: ${errText}`);
        }

        const data = await response.json();
        
        // Save to Prisma
        await prisma.notionConnection.create({
          data: {
            userId,
            accessToken: data.access_token,
            workspaceId: data.workspace_id,
            workspaceName: data.workspace_name,
            botId: data.bot_id,
            status: "active"
          }
        });
        
        break;
      }
      
      case "google_tasks": {
        const clientId = process.env.GOOGLE_CLIENT_ID || "";
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
        const redirectUri = `${appUrl}/api/auth/providers/google_tasks/callback`;

        const response = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            code,
            grant_type: "authorization_code",
            redirect_uri: redirectUri
          })
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Google Tasks OAuth failed: ${errText}`);
        }

        const data = await response.json();
        
        // Save to Prisma
        await prisma.googleTasksConnection.create({
          data: {
            userId,
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            status: "active"
          }
        });
        
        break;
      }
      
      default:
        throw new Error(`Unsupported OAuth provider: ${provider}`);
    }
  }
}
