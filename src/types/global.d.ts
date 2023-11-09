import { Client } from 'discord.js';

export type broadcast = {
  fullMessage?: any;
  chat?: any;
  chatType?: any;
  username: any;
  rank?: any;
  guildRank?: any;
  message: any;
  color?: any;
  channel?: any;
  replyingTo?: any;
  discord?: any;
};

export type broadcastCleanEmbed = {
  message: any;
  color: any;
  channel: any;
};

export type broadcastHeadedEmbed = {
  message: any;
  title: any;
  icon: any;
  color: any;
  channel: any;
};

export type playerToggle = {
  fullMessage: any;
  username: any;
  message: any;
  color: any;
  channel: any;
};

declare global {
  let bot: any;
  let client: Client;
}

export type maxSkillsLevelsType = {
  farming: number;
  mining: number;
  combat: number;
  foraging: number;
  fishing: number;
  enchanting: number;
  alchemy: number;
  taming: number;
  carpentry: number;
  runecrafting: number;
  social: number;
  dungeoneering: number;
};

export type slayerXpType = {
  zombie: number[];
  spider: number[];
  wolf: number[];
  enderman: number[];
  blaze: number[];
  vampire: number[];
};

export type xpTablesType = {
  max_levels: maxSkillsLevelsType;
  normal: number[];
  social: number[];
  runecrafting: number[];
  catacombs: number[];
  slayer: slayerXpType;
};
