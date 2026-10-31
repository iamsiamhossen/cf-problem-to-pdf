console.log("[CF-PDF] service worker started");

// Test: extension reload korle icon e "ON" dekhale background code run hocche
chrome.action.setBadgeText({ text: "ON" });
chrome.action.setBadgeBackgroundColor({ color: "#188038" });

chrome.action.onClicked.addListener(async (tab) => {
  console.log("[CF-PDF] icon clicked, tab:", tab.id, tab.url);

  const tabId = tab.id;
  if (!tabId) return;

  try {
    const res = await chrome.tabs.sendMessage(tabId, { type: "EXPORT_PDF" });
    console.log("[CF-PDF] response:", res);
    if (!res?.ok) throw new Error(res?.error ?? "Export failed");
    await chrome.action.setBadgeText({ tabId, text: "" });
  } catch (err) {
    console.error("[CF-PDF] export failed:", err);
    await chrome.action.setBadgeBackgroundColor({ tabId, color: "#d93025" });
    await chrome.action.setBadgeText({ tabId, text: "!" });
  }
});