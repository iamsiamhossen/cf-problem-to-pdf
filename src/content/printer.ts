import katexCss from "katex/dist/katex.min.css?raw";
import type { Problem } from "../types";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const STYLE_ID = "cf-pdf-style";
const ROOT_ID = "cf-pdf-root";

const FONT_BASE = chrome.runtime.getURL("fonts/");

const FONT_FILES = {
  regular: "lmroman-regular.woff",
  italic: "lmroman-italic.woff",
  bold: "lmroman-bold.woff",
  boldItalic: "lmroman-bolditalic.woff",
};

const fmt = (f: string) =>
  f.endsWith(".woff2") ? "woff2" : f.endsWith(".woff") ? "woff" : f.endsWith(".otf") ? "opentype" : "truetype";

const lmFace = (file: string, weight: number, style: string) =>
  `@font-face{font-family:"LM Roman";src:url(${FONT_BASE}lm/${file}) format("${fmt(file)}");font-weight:${weight};font-style:${style};font-display:block;}`;

const FONT_CSS = [
  katexCss.replace(/url\(fonts\//g, `url(${FONT_BASE}katex/`),
  lmFace(FONT_FILES.regular, 400, "normal"),
  lmFace(FONT_FILES.italic, 400, "italic"),
  lmFace(FONT_FILES.bold, 700, "normal"),
  lmFace(FONT_FILES.boldItalic, 700, "italic"),
].join("\n");

const TEXT_FONT = `"LM Roman", "Latin Modern Roman", "CMU Serif", "Times New Roman", serif`;

const PRINT_CSS = `
#${ROOT_ID} { display: none; }

@media print {
  @page { size: A4; margin: 18mm 16mm; }

  html.cf-pdf-printing body > *:not(#${ROOT_ID}) { display: none !important; }
  html.cf-pdf-printing #${ROOT_ID} { display: block !important; }

  #${ROOT_ID} {
    font-family: ${TEXT_FONT};
    font-size: 11pt;
    line-height: 1.4;
    color: #000;
    background: #fff;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  #${ROOT_ID} h1 { font-size: 18pt; font-weight: 700; margin: 0 0 4pt; text-align: center; }
  #${ROOT_ID} .meta { text-align: center; font-size: 10pt; margin-bottom: 14pt; font-style: italic; }
  #${ROOT_ID} h2 { font-size: 12.5pt; font-weight: 700; margin: 14pt 0 5pt; }
  #${ROOT_ID} p { margin: 0 0 6pt; text-align: justify; }
  #${ROOT_ID} ul, #${ROOT_ID} ol { margin: 4pt 0 6pt 18pt; padding: 0; }
  #${ROOT_ID} li { margin-bottom: 2pt; }

  #${ROOT_ID} .tex-font-style-it { font-style: italic; }
  #${ROOT_ID} .tex-font-style-bf { font-weight: 700; }
  #${ROOT_ID} .tex-font-style-tt { font-family: KaTeX_Typewriter, Consolas, monospace; }

  #${ROOT_ID} .katex { font-size: 1.05em; }
  #${ROOT_ID} .katex-display { margin: 8pt 0; }
  #${ROOT_ID} .cf-math-display { margin: 8pt 0; text-align: center; }

  #${ROOT_ID} .sample { margin-bottom: 10pt; break-inside: avoid; }
  #${ROOT_ID} .sample .label { font-weight: 700; font-size: 10pt; margin: 6pt 0 2pt; }
  #${ROOT_ID} pre {
    background: #f6f6f6; border: 1px solid #ccc; border-radius: 2px;
    padding: 6pt 8pt; margin: 0; white-space: pre-wrap;
    font-family: KaTeX_Typewriter, Consolas, monospace; font-size: 10pt; line-height: 1.3;
  }
  #${ROOT_ID} img { max-width: 100%; }
  #${ROOT_ID} .source { margin-top: 20pt; font-size: 9pt; color: #555; }
}
`;

function buildHtml(p: Problem): string {
  const limits = [
    p.timeLimit && `time limit per test: ${esc(p.timeLimit)}`,
    p.memoryLimit && `memory limit per test: ${esc(p.memoryLimit)}`,
    p.inputFile && `input: ${esc(p.inputFile)}`,
    p.outputFile && `output: ${esc(p.outputFile)}`,
  ]
    .filter(Boolean)
    .join(" &nbsp;|&nbsp; ");

  const samples = p.samples
    .map(
      (s, i) => `
      <div class="sample">
        <div class="label">Input ${i + 1}</div><pre>${esc(s.input)}</pre>
        <div class="label">Output ${i + 1}</div><pre>${esc(s.output)}</pre>
      </div>`,
    )
    .join("");

  return `
    <h1>${esc(p.title)}</h1>
    <div class="meta">${limits}</div>
    <div>${p.legendHtml}</div>
    ${p.inputSpecHtml ? `<h2>Input</h2><div>${p.inputSpecHtml}</div>` : ""}
    ${p.outputSpecHtml ? `<h2>Output</h2><div>${p.outputSpecHtml}</div>` : ""}
    ${samples ? `<h2>Examples</h2>${samples}` : ""}
    ${p.noteHtml ? `<h2>Note</h2><div>${p.noteHtml}</div>` : ""}
    <div class="source">Source: ${esc(p.url)}</div>
  `;
}

const FONT_LOADS = [
  "400 1em 'LM Roman'",
  "italic 400 1em 'LM Roman'",
  "700 1em 'LM Roman'",
  "italic 700 1em 'LM Roman'",
  "1em KaTeX_Main",
  "italic 1em KaTeX_Main",
  "bold 1em KaTeX_Main",
  "italic bold 1em KaTeX_Main",
  "italic 1em KaTeX_Math",
  "italic bold 1em KaTeX_Math",
  "1em KaTeX_AMS",
  "1em KaTeX_Size1",
  "1em KaTeX_Size2",
  "1em KaTeX_Size3",
  "1em KaTeX_Size4",
  "1em KaTeX_Caligraphic",
  "bold 1em KaTeX_Caligraphic",
  "1em KaTeX_Fraktur",
  "bold 1em KaTeX_Fraktur",
  "1em KaTeX_SansSerif",
  "bold 1em KaTeX_SansSerif",
  "italic 1em KaTeX_SansSerif",
  "1em KaTeX_Script",
  "1em KaTeX_Typewriter",
];

/** Print er age font gulo puro load kore nei, na hole PDF e fallback font ashe */
async function loadFonts(): Promise<void> {
  await Promise.allSettled(FONT_LOADS.map((f) => document.fonts.load(f)));
  await document.fonts.ready;
}

export async function printProblem(problem: Problem): Promise<void> {
  document.getElementById(ROOT_ID)?.remove();
  document.getElementById(STYLE_ID)?.remove();

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = FONT_CSS + "\n" + PRINT_CSS;
  document.head.appendChild(style);

  const root = document.createElement("div");
  root.id = ROOT_ID;
  root.innerHTML = buildHtml(problem);
  document.body.appendChild(root);

  await loadFonts();

  document.documentElement.classList.add("cf-pdf-printing");
  window.addEventListener(
    "afterprint",
    () => {
      document.documentElement.classList.remove("cf-pdf-printing");
      root.remove();
    },
    { once: true },
  );

  requestAnimationFrame(() => requestAnimationFrame(() => window.print()));
}