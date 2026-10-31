import { extractProblem } from "./extractor";
import { printProblem } from "./printer";
console.log("[CF-PDF] content script loaded");

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.type !== "EXPORT_PDF") return;

  const problem = extractProblem();
  if (!problem) {
    sendResponse({ ok: false, error: "No problem statement found" });
    return;
  }

  sendResponse({ ok: true });
  void printProblem(problem);
});