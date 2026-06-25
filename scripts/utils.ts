import { format } from "prettier";
import { markdownTable } from "markdown-table";
import { readFile, writeFile } from "node:fs/promises";
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
