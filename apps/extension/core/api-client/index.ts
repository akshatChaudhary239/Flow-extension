export class ApiClient {
  private baseUrl = process.env.PLASMO_PUBLIC_API_URL || "http://localhost:3000/api";

  async post(path: string, body: any) {
    console.log(`[ApiClient] Preparing to send message to background script for ${path}`, body);
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        {
          action: "API_POST",
          payload: {
            path,
            body,
            baseUrl: this.baseUrl
          }
        },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error("[ApiClient] chrome.runtime.lastError:", chrome.runtime.lastError);
            return reject(new Error(chrome.runtime.lastError.message));
          }
          console.log(`[ApiClient] Received response from background script:`, response);
          if (!response || !response.success) {
            return reject(new Error(response?.error || "Unknown background fetch error"));
          }
          resolve(response.data);
        }
      );
    });
  }
}

export const apiClient = new ApiClient();
