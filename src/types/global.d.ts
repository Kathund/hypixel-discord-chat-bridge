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
  // eslint-disable-next-line no-var
  var bot: any;
  // eslint-disable-next-line no-var
  var client: Client;
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
  [key: string]: number;
};

export type slayerXpType = {
  zombie: number[];
  spider: number[];
  wolf: number[];
  enderman: number[];
  blaze: number[];
  vampire: number[];
};

export type LilySkills = {
  skills_levels: number[];
  skills_experience: number[];
};

export type LilyDungeons = {
  catacombs: Record<string, number>;
  master_mode: Record<string, number>;
  catacombs_experience: number;
};

export type LilySlayer = {
  slayer_experience: number[];
};

export type DungeonWeights = {
  catacombs: number;
  healer: number;
  mage: number;
  berserk: number;
  archer: number;
  tank: number;
  [key: string]: number;
};

export type SlayerWeights = {
  [key: string]: {
    divider: number;
    modifier: number;
  };
};

export type SkillWeights = {
  [key: string]: {
    exponent: number;
    divider: number;
    maxLevel: number;
  };
};

export type SlayerType = keyof SlayerWeights;

export type SlayerWeightResult = {
  weight: number;
  weight_overflow: number;
};

export type SkillType = keyof SkillWeights;

export type SkillWeightResult = {
  weight: number;
  weight_overflow: number;
};

export type DungeonType = keyof DungeonWeights;

export type DungeonWeightResult = {
  weight: number;
  weight_overflow: number;
};

export type SenitherType = SlayerType | DungeonType | SkillType;

export type SkillCalcResult = {
  totalXp: number;
  xp: number;
  level: number;
  xpCurrent: number;
  xpForNext: number;
  progress: number;
  levelWithProgress: number;
};

export type symbolType = {
  name: string;
  nameLore: string;
  nameShort: string;
  nameTiny: string;
  symbol: string;
  suffix: string;
  color: string;
};

export type Symbols = Record<string, symbolType>;

export type Rarity = 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC';

export type StatData = {
  common?: any;
  uncommon?: any;
  rare?: any;
  epic?: any;
  legendary?: any;
  mythic?: any;
};
