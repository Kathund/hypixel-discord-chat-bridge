import { Collection, SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
export interface SlashCommand {
  data: SlashCommandBuilder;
  execute: (interaction: ChatInputCommandInteraction) => void;
}
declare module 'discord.js' {
  export interface Client {
    commands: Collection<string, SlashCommand>;
  }
}
