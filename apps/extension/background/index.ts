chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "API_POST") {
    const { path, body, baseUrl } = request.payload;

    fetch(`${baseUrl}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`API Error: ${response.statusText}`);
        }
        const data = await response.json();
        sendResponse({ success: true, data });
      })
      .catch((error) => {
        console.error("Background API Fetch Error:", error);
        sendResponse({ success: false, error: error.message });
      });

    return true; // Keep the messaging channel open for async response
  }
});

chrome.commands.onCommand.addListener((command) => {
  if (command === "toggle_flow_palette") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab?.id) {
        chrome.tabs.sendMessage(activeTab.id, { action: "TOGGLE_FLOW_PALETTE" });
      }
    });
  }
});
