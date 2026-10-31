import { defineManifest } from "@crxjs/vite-plugin";

export default defineManifest({
  manifest_version: 3,
  name: "CF Problem to PDF",
  version: "1.0.0",
  description: "Click to save any Codeforces problem as a clean PDF.",
  action: { default_title: "Save problem as PDF" },
  background: { service_worker: "src/background/background.ts", type: "module" },
  content_scripts: [
    {
      matches: [
        "https://codeforces.com/problemset/problem/*",
        "https://codeforces.com/contest/*/problem/*",
        "https://codeforces.com/gym/*/problem/*",
      ],
      js: ["src/content/content.ts"],
    },
  ],
  web_accessible_resources: [
    { resources: ["fonts/*"], matches: ["https://codeforces.com/*"] },
  ],
});