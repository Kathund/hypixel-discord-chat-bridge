import HypixelDiscordChatBridgeError from '../private/error.ts';
import chalk from 'chalk';
import { DiscordjsError } from 'discord.js';
import { ErrorEmbed } from '../discord/private/EmbedHelper.ts';
import { HypixelAPIRebornError } from 'hypixel-api-reborn';
import { MinecraftRequestTimeoutError } from '../minecraft/MinecraftRequestBroker.ts';
import { readdir, stat, unlink } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { DevData, ValidErrors } from '../types/application.ts';
import type { EmbedHelperField } from '../types/discord.ts';

export async function deleteExpiredFiles(
  directory: string,
  cutoff: number,
  shouldDelete: (fileName: string) => boolean = () => true
): Promise<void> {
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') return;
    throw error;
  }

  for (const entry of entries) {
    const entryPath = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      await deleteExpiredFiles(entryPath, cutoff, shouldDelete);
    } else if (entry.isFile() && shouldDelete(entry.name) && (await stat(entryPath)).mtimeMs < cutoff) {
      await unlink(entryPath);
    }
  }
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getNestedValue(obj: unknown, path: string): unknown {
  let current = obj;
  for (const key of path.split('.')) {
    if (typeof current !== 'object' || current === null || Array.isArray(current)) return undefined;
    current = Reflect.get(current, key);
  }
  return current;
}

export function displayBigMessage(message: string) {
  const columns = process.stdout.columns;
  const warning = 'IMPORTANT!';
  const padding = ' '.repeat(Math.floor((columns - warning.length + 1) / 2));
  const padding2 = ' '.repeat(Math.floor((columns - message.length + 1) / 2));

  console.log(chalk.bgRed.black(' '.repeat(columns).repeat(3)));
  console.log(chalk.bgRed.black(padding + warning + padding));
  console.log(chalk.bgRed.black(padding2 + message + padding2));
  console.log(chalk.bgRed.black(' '.repeat(columns).repeat(3)));
}

export function generateId(length: number): string {
  let result = '';
  const characters = 'abcde0123456789';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}

export function formatError(error: ValidErrors): string {
  return error
    .toString()
    .replace('Hypixel-API-Reborn', 'hypixel-api-reborn')
    .replace('[hypixel-api-reborn] ', '')
    .replace('For help join our Discord Server https://discord.gg/NSEBNMM', '')
    .replace('Error:', '[ERROR]');
}

// CREDIT: https://github.com/Senither/hypixel-skyblock-facade (Modified)
export function isUuid(uuid: string): boolean {
  if (uuid === undefined || uuid === null || typeof uuid !== 'string') {
    return false;
  }

  return (
    /^[0-9a-fA-F]{8}[0-9a-fA-F]{4}[0-9a-fA-F]{4}[0-9a-fA-F]{4}[0-9a-fA-F]{12}$/.test(uuid) ||
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(uuid)
  );
}

export function getErrorString(error: Error): string {
  const message = error.toString();
  const stack = error.stack
    ?.replaceAll(message, '')
    .replaceAll('HypixelDiscordChatBridgeError:', '\nHypixelDiscordChatBridgeError:');
  return [message, stack, error.cause ? `Cause: ${String(error.cause)}` : undefined].filter(Boolean).join('');
}

export function getErrorTypeName(error: ValidErrors): string {
  if (error instanceof HypixelDiscordChatBridgeError) return 'HypixelDiscordChatBridgeError';
  else if (error instanceof HypixelAPIRebornError) return 'HypixelAPIRebornError';
  else if (error instanceof DiscordjsError) return 'DiscordJsError';
  else if (error instanceof MinecraftRequestTimeoutError) return 'MinecraftRequestTimeoutError';
  return 'Generic Error';
}

export function convertDevDataToName({ discord, displayName }: DevData, includeMention: boolean = false): string {
  if (includeMention) {
    return `${discord !== undefined ? `${displayName} (@${discord.username} | <@${discord.id}>)` : displayName}`;
  }
  return `${discord !== undefined ? `${displayName} (@${discord.username})` : displayName}`;
}

export function getErrorEmbed(error: ValidErrors, extraData: EmbedHelperField[] = []): ErrorEmbed {
  const errorStack = error instanceof Error ? (error.stack ?? error.message) : String(error ?? 'Unknown');
  return new ErrorEmbed()
    .setDescription(`\`\`\`${errorStack}\`\`\``)
    .setFields(...[{ name: 'Error Type', value: getErrorTypeName(error) }, ...extraData]);
}
