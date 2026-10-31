# CF Problem to PDF

<p align="center">
  <strong>A Chrome extension for converting Codeforces problem statements into clean, print-ready PDFs.</strong>
  <br />
  Extract problem content, preserve mathematical notation, and prepare an A4-formatted document directly in your browser.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Chrome-Manifest%20V3-4285F4?logo=googlechrome&logoColor=white" alt="Chrome Manifest V3" />
  <img src="https://img.shields.io/badge/TypeScript-Enabled-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Math-KaTeX-1E9B50" alt="KaTeX" />
  <img src="https://img.shields.io/badge/Build-Vite-646CFF?logo=vite&logoColor=white" alt="Vite" />
</p>

---

## Background

While practicing competitive programming, I often needed to save problem statements for offline reading, revision, and printing.

However, copying problem statements into a document was not always convenient. Mathematical expressions could lose their original formatting, code examples required additional adjustments, and the resulting documents often lacked a consistent layout.

I wanted a straightforward solution that could handle this process directly from Codeforces.

The idea was simple:

**Open a problem, click the extension, and get a document ready to save as PDF.**

This led to the development of **CF Problem to PDF**, a lightweight browser extension focused on improving how competitive programming problem statements are saved and reviewed.

## Key Features

- **Problem Extraction:** Extracts problem statements directly from supported Codeforces pages.
- **Mathematical Rendering:** Processes mathematical expressions and renders them using KaTeX.
- **Print-Optimized Layout:** Presents extracted content in a clean, A4-oriented format.
- **Code Formatting:** Maintains readable formatting for sample inputs, outputs, and code blocks.
- **Multiple Page Types:** Supports Codeforces Problemset, Contest, and Gym problem pages.
- **Local Processing:** Works directly in the browser without requiring a backend, external API, or user account.

## Installation

### Install from Source

**1. Clone the repository**

```bash
git clone https://github.com/iamsiamhossen/cf-problem-to-pdf.git
```

**2. Navigate to the project directory**

```bash
cd cf-problem-to-pdf
```

**3. Install dependencies**

```bash
npm ci
```

**4. Build the extension**

```bash
npm run build
```

**5. Load the extension in Chrome**

1. Open `chrome://extensions` in Google Chrome.
2. Enable **Developer mode**.
3. Select **Load unpacked**.
4. Choose the generated `dist` folder from the project directory.

The extension is now ready to use.

## Usage

1. Open a supported problem page on [Codeforces](https://codeforces.com/).
2. Click the **CF Problem to PDF** extension icon in the Chrome toolbar.
3. Wait for the print-ready document to open.
4. Select **Save as PDF** in the Chrome print dialog.
5. Choose the destination and save the document.

**Recommended setting:** Select A4 as the paper size in the print settings.

## Technology Stack

| Technology | Purpose |
|---|---|
| TypeScript | Extension logic and type safety |
| Chrome Manifest V3 | Browser extension platform |
| Vite | Development and build tooling |
| CRXJS | Chrome extension integration |
| KaTeX | Mathematical expression rendering |
| CSS | Document layout and print styling |

## Project Structure

```text
cf-problem-to-pdf/
├── public/
│   ├── fonts/
│   │   └── katex/
│   ├── favicon.svg
│   └── icons.svg
├── scripts/
│   └── fix-chrome-utf8.mjs
├── src/
│   ├── background/
│   │   └── background.ts
│   ├── content/
│   │   ├── content.ts
│   │   ├── extractor.ts
│   │   ├── math.ts
│   │   └── printer.ts
│   ├── styles.css
│   └── types/
│       └── index.ts
├── manifest.config.ts
├── vite.config.ts
└── package.json
```

## Development

### Requirements

- Node.js
- npm
- Google Chrome

### Available Commands

| Command | Description |
|---|---|
| `npm run dev` | Starts the Vite development environment |
| `npm run build` | Runs TypeScript checks and builds the extension |
| `npm run lint` | Runs ESLint checks |

After building, load or reload the `dist` folder from `chrome://extensions`.

## Scope and Limitations

- Designed specifically for Codeforces problem pages.
- Requires Google Chrome or a compatible Chromium-based browser with Manifest V3 support.
- Uses the browser's native print dialog; PDF files are not downloaded automatically.
- Final document appearance may vary depending on browser print settings.

---

<p align="center">
  <strong>Developed for the competitive programming community.</strong>
  <br />
  <sub>Developed by <a href="https://github.com/iamsiamhossen">Siam Hossen</a></sub>
  <br /><br />
  <a href="https://github.com/iamsiamhossen/cf-problem-to-pdf">GitHub Repository</a>
</p>
