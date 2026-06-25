import { access, readFile, writeFile } from "node:fs/promises";
import { format } from "prettier";
import { markdownTable } from "markdown-table";
import { replaceVariables } from "../src/utils/stringUtils.js";
import "../src/private/logger.js";

export function addLines(content: string, lines: string[]): string[] {
  lines.push(...content.split("\n").map((line) => line.trim()));
  return lines;
}

export async function addFile(path: string, lines: string[]): Promise<string[]> {
  const content = await readFile(path, "utf-8");
  return addLines(content, lines);
}

export function addTable(table: string[][], lines: string[]): string[] {
  return addLines(markdownTable(table), lines);
}

export async function saveFile(path: string, data: string) {
  const prettierFile = await readFile("./.prettierrc", "utf-8");
  const prettierConfig = JSON.parse(prettierFile);
  const formatted = await format(data, { ...prettierConfig, filepath: path });
  await writeFile(path, formatted, "utf-8");
  console.other(`File Saved - ${path}`);
}

export async function initMarkdownFile(path: string): Promise<string[]> {
  const id = path.replaceAll(".md", "").split("/")[1];
  if (!id) throw new Error("Something went wrong with getting the id");
  const headerPath = `./scripts/templates/${id}/Header.md`;
  let lines: string[] = [];

  try {
    await access(headerPath);
    lines = await addFile(headerPath, lines);
  } catch {
    // Do nothing
  }

  return lines;
}

export async function saveMarkdownFile(path: string, lines: string[]) {
  const id = path.replaceAll(".md", "").split("/")[1];
  if (!id) throw new Error("Something went wrong with getting the id");
  const footerPath = `./scripts/templates/${id}/Footer.md`;

  try {
    await access(footerPath);
    lines = await addFile(footerPath, lines);
  } catch {
    // Do nothing
  }

  const utilsFooter = await readFile("./scripts/templates/Utils/Footer.md", "utf-8");
  lines = addLines(replaceVariables(utilsFooter, { id }), lines);

  const globalUtilsFooter = await readFile("./scripts/templates/Utils/GlobalFooter.md", "utf-8");
  lines = addLines(replaceVariables(globalUtilsFooter, { id }), lines);

  await saveFile(path, lines.join("\n"));
}
