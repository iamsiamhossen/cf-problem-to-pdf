import katex from "katex";

const MATHJAX_JUNK = [
  ".MathJax_Preview",
  ".MathJax",
  ".MathJax_Display",
  ".MathJax_SVG",
  ".MathJax_SVG_Display",
  ".MathJax_CHTML",
  ".MJX_Assistive_MathML",
  "mjx-container",
].join(",");

function render(tex: string, display: boolean): string {
  return katex.renderToString(tex.trim(), {
    displayMode: display,
    throwOnError: false,
    output: "html",
    strict: "ignore",
  });
}

function makeHolder(tex: string, display: boolean): HTMLElement {
  const el = document.createElement(display ? "div" : "span");
  el.className = display ? "cf-math cf-math-display" : "cf-math";
  el.innerHTML = render(tex, display);
  return el;
}

/** root er bhetor shob math ke KaTeX HTML diye replace kore (root ke in-place bodlay) */
export function convertMath(root: Element): void {
  // 1) MathJax age thekei render korle: original TeX <script type="math/tex"> e thake
  const scripts = Array.from(
    root.querySelectorAll<HTMLScriptElement>('script[type^="math/tex"]'),
  );
  if (scripts.length > 0) {
    root.querySelectorAll(MATHJAX_JUNK).forEach((el) => el.remove());
    for (const s of scripts) {
      const display = /mode\s*=\s*display/.test(s.type);
      s.replaceWith(makeHolder(s.textContent ?? "", display));
    }
  }

  // 2) MathJax chole ni hole: text e $$$...$$$ (inline) ar $$$$$$...$$$$$$ (display)
  const re = /\$\$\$\$\$\$([\s\S]+?)\$\$\$\$\$\$|\$\$\$([\s\S]+?)\$\$\$/g;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);

  for (const node of nodes) {
    const value = node.nodeValue ?? "";
    if (!value.includes("$$$")) continue;
    if (node.parentElement?.closest("pre, script, style")) continue;

    const frag = document.createDocumentFragment();
    let last = 0;
    let matched = false;
    for (const m of value.matchAll(re)) {
      matched = true;
      const idx = m.index ?? 0;
      if (idx > last) frag.append(value.slice(last, idx));
      const display = m[1] !== undefined;
      frag.append(makeHolder(m[1] ?? m[2], display));
      last = idx + m[0].length;
    }
    if (!matched) continue;
    if (last < value.length) frag.append(value.slice(last));
    node.replaceWith(frag);
  }
}