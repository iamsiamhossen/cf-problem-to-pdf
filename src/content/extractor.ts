import type { Problem, Sample } from "../types";
import { convertMath } from "./math";

const text = (el: Element | null | undefined) => el?.textContent?.trim() ?? "";

function headerValue(statement: Element, selector: string): string {
  const el = statement.querySelector(selector);
  if (!el) return "";
  const clone = el.cloneNode(true) as Element;
  clone.querySelector(".property-title")?.remove();
  return text(clone);
}

function preToText(pre: Element): string {
  const clone = pre.cloneNode(true) as Element;
  clone.querySelectorAll("br").forEach((br) => br.replaceWith("\n"));
  const lines = clone.querySelectorAll(".test-example-line");
  if (lines.length > 0) {
    return Array.from(lines)
      .map((l) => l.textContent ?? "")
      .join("\n")
      .trim();
  }
  return (clone.textContent ?? "").trim();
}

function extractSamples(statement: Element): Sample[] {
  const inputs = statement.querySelectorAll(".sample-test .input pre");
  const outputs = statement.querySelectorAll(".sample-test .output pre");
  const count = Math.min(inputs.length, outputs.length);
  const samples: Sample[] = [];
  for (let i = 0; i < count; i++) {
    samples.push({
      input: preToText(inputs[i]),
      output: preToText(outputs[i]),
    });
  }
  return samples;
}

function sectionHtml(el: Element | null | undefined): string {
  if (!el) return "";
  const clone = el.cloneNode(true) as Element;
  clone.querySelector(".section-title")?.remove();
  return clone.innerHTML.trim();
}

export function extractProblem(): Problem | null {
  const original = document.querySelector(".problem-statement");
  if (!original) return null;

  // Page ke na chhuye clone e math ke KaTeX e convert kori
  const statement = original.cloneNode(true) as Element;
  convertMath(statement);

  const header = statement.querySelector(".header");
  const legend = header?.nextElementSibling ?? null;

  return {
    url: location.href,
    title: text(header?.querySelector(".title")),
    timeLimit: headerValue(statement, ".time-limit"),
    memoryLimit: headerValue(statement, ".memory-limit"),
    inputFile: headerValue(statement, ".input-file"),
    outputFile: headerValue(statement, ".output-file"),
    legendHtml: legend?.innerHTML.trim() ?? "",
    inputSpecHtml: sectionHtml(statement.querySelector(".input-specification")),
    outputSpecHtml: sectionHtml(statement.querySelector(".output-specification")),
    samples: extractSamples(statement),
    noteHtml: sectionHtml(statement.querySelector(".note")),
  };
}