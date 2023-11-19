/* eslint-disable @typescript-eslint/no-explicit-any */
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
  [key: string]: number[];
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

export type SlayerWeightType = keyof SlayerWeights;

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

export type SenitherType = SlayerWeightType | DungeonType | SkillType;

export type SkillCalcResult = {
  totalXp: number;
  xp: number;
  level: number;
  xpCurrent: number;
  xpForNext: number;
  progress: number;
  levelWithProgress: number;
};

type CalcSkillsResult = {
  [key: string]: SkillCalcResult;
  farming: SkillCalcResult;
  mining: SkillCalcResult;
  combat: SkillCalcResult;
  foraging: SkillCalcResult;
  fishing: SkillCalcResult;
  enchanting: SkillCalcResult;
  alchemy: SkillCalcResult;
  carpentry: SkillCalcResult;
  runecrafting: SkillCalcResult;
  social: SkillCalcResult;
  taming: SkillCalcResult;
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
  comMONTEZUMA?: any;
};

export type jacobsContest = {
  time: number;
  crops: string[];
};

export type WeightObject = {
  senither: {
    total: number;
    weight: number;
    weight_overflow: number;
    skills: {
      [key: string]: {
        total: number;
        weight: number;
        weight_overflow: number;
      };
      farming: {
        total: number;
        weight: number;
        weight_overflow: number;
      };
      mining: {
        total: number;
        weight: number;
        weight_overflow: number;
      };
      combat: {
        total: number;
        weight: number;
        weight_overflow: number;
      };
      foraging: {
        total: number;
        weight: number;
        weight_overflow: number;
      };
      fishing: {
        total: number;
        weight: number;
        weight_overflow: number;
      };
      enchanting: {
        total: number;
        weight: number;
        weight_overflow: number;
      };
      alchemy: {
        total: number;
        weight: number;
        weight_overflow: number;
      };
      taming: {
        total: number;
        weight: number;
        weight_overflow: number;
      };
    };
    slayer: {
      total: number;
      weight: number;
      weight_overflow: number;
      slayer: {
        revenant: {
          total: number;
          weight: number;
          weight_overflow: number;
        };
        tarantula: {
          total: number;
          weight: number;
          weight_overflow: number;
        };
        sven: {
          total: number;
          weight: number;
          weight_overflow: number;
        };
        enderman: {
          total: number;
          weight: number;
          weight_overflow: number;
        };
      };
    };
    dungeons: {
      total: number;
      weight: number;
      weight_overflow: number;
      catacombs: {
        total: number;
        weight: number;
        weight_overflow: number;
      };
      classes: {
        healer: {
          total: number;
          weight: number;
          weight_overflow: number;
        };
        mage: {
          total: number;
          weight: number;
          weight_overflow: number;
        };
        berserk: {
          total: number;
          weight: number;
          weight_overflow: number;
        };
        archer: {
          total: number;
          weight: number;
          weight_overflow: number;
        };
        tank: {
          total: number;
          weight: number;
          weight_overflow: number;
        };
      };
    };
  };
  lily: {
    total: number;
    skills: {
      total: number;
      base: number;
      overflow: number;
    };
    slayer: {
      total: number;
    };
    catacombs: {
      total: number;
      completion: {
        base: number;
        master: number;
      };
      experience: number;
    };
  };
};

export type skyblockSlayer = {
  xp: number;
  totalKills: number;
  level: number;
  xpForNext: number;
  progress: number;
  kills: any;
};

export type skyblockSlayers = {
  [key: string]: skyblockSlayer;
  zombie: skyblockSlayer;
  spider: skyblockSlayer;
  wolf: skyblockSlayer;
  enderman: skyblockSlayer;
  blaze: skyblockSlayer;
  vampire: skyblockSlayer;
};

export type DungeonStats = {
  selected_class: 'Healer' | 'Mage' | 'Berserk' | 'Archer' | 'Tank' | string;
  secrets_found: number;
  classes: {
    healer: SkillCalcResult;
    mage: SkillCalcResult;
    berserk: SkillCalcResult;
    archer: SkillCalcResult;
    tank: SkillCalcResult;
  };
  catacombs: {
    skill: SkillCalcResult;
    perks: {
      catacombs_boss_luck: number;
      catacombs_looting: number;
      catacombs_intelligence: number;
      catacombs_health: number;
      catacombs_strength: number;
      catacombs_crit_damage: number;
      catacombs_defense: number;
      permanent_speed: number;
      permanent_intelligence: number;
      permanent_health: number;
      permanent_defense: number;
      permanent_strength: number;
      forbidden_blessing: number;
      revive_stone: number;
    };
    HIGEHST_TIER_COMPLETED:
      | 'F1'
      | 'F2'
      | 'F3'
      | 'F4'
      | 'F5'
      | 'F6'
      | 'F7'
      | 'M1'
      | 'M2'
      | 'M3'
      | 'M4'
      | 'M5'
      | 'M6'
      | 'M7'
      | null
      | string;
    floors: {
      [key: string]: {
        times_played: number;
        completions: number;
        best_score: {
          score: number;
          name: string;
        };
        fastest: number;
        fastest_s: number;
        fastest_s_plus: number;
        mobs_killed: number;
      };
    };
    MASTER_MODE_FLOORS: {
      [key: string]: {
        completions: number;
        best_score: {
          score: number;
          name: string;
        };
        fastest: number;
        fastest_s: number;
        fastest_s_plus: number;
        mobs_killed: number;
      };
    };
  };
};

export type TalismansOutput = {
  common: number;
  uncommon: number;
  rare: number;
  epic: number;
  legendary: number;
  mythic: number;
  special: number;
  very: number;
  recombed: number;
  enriched: number;
  total: number;
} | null;

export type RGBA_COLOR_TYPE = {
  [key: string]: string;
  [key: number]: string;
  0: string;
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string;
  7: string;
  8: string;
  9: string;
  a: string;
  b: string;
  c: string;
  d: string;
  e: string;
  f: string;
};

export type variablesType = {
  [key: string]: string | undefined;
  chatType?: string;
  username?: string;
  rank?: string;
  guildRank?: string;
  message?: string;
  prefix?: string;
  time?: string;
  level?: string;
};

export type SenitherWeightResult = {
  skills: {
    farming: SkillWeightResult | null;
    mining: SkillWeightResult | null;
    combat: SkillWeightResult | null;
    foraging: SkillWeightResult | null;
    fishing: SkillWeightResult | null;
    enchanting: SkillWeightResult | null;
    alchemy: SkillWeightResult | null;
    taming: SkillWeightResult | null;
  };
  slayer: {
    revenant: SlayerWeightResult | null;
    tarantula: SlayerWeightResult | null;
    sven: SlayerWeightResult | null;
    enderman: SlayerWeightResult | null;
  };
  dungeons: {
    catacombs: DungeonWeightResult | null;
    classes: {
      healer: DungeonWeightResult | null;
      mage: DungeonWeightResult | null;
      berserk: DungeonWeightResult | null;
      archer: DungeonWeightResult | null;
      tank: DungeonWeightResult | null;
    };
  };
};

export type bestiaryBracketsType = {
  1: number[];
  2: number[];
  3: number[];
  4: number[];
  5: number[];
  6: number[];
  7: number[];
  [key: number]: number[];
};

export type bestiaryMobType = {
  name: string;
  cap: number;
  texture: string;
  mobs: string[];
  bracket: number;
};

export type bestiaryType = {
  dynamic: {
    name: string;
    texture: string;
    mobs: bestiaryMobType[];
  };
  hub: {
    name: string;
    texture: string;
    mobs: bestiaryMobType[];
  };
  farming_1: {
    name: string;
    texture: string;
    mobs: bestiaryMobType[];
  };
  combat_1: {
    name: string;
    texture: string;
    mobs: bestiaryMobType[];
  };
  combat_3: {
    name: string;
    texture: string;
    mobs: bestiaryMobType[];
  };
  crimson_isle: {
    name: string;
    texture: string;
    mobs: bestiaryMobType[];
  };
  mining_2: {
    name: string;
    texture: string;
    mobs: bestiaryMobType[];
  };
  mining_3: {
    name: string;
    texture: string;
    mobs: bestiaryMobType[];
  };
  crystal_hollows: {
    name: string;
    texture: string;
    mobs: bestiaryMobType[];
  };
  foraging_1: {
    name: string;
    texture: string;
    mobs: bestiaryMobType[];
  };
  spooky_festival: {
    name: string;
    texture: string;
    mobs: bestiaryMobType[];
  };
  mythological_creatures: {
    name: string;
    texture: string;
    mobs: bestiaryMobType[];
  };
  jerry: {
    name: string;
    texture: string;
    mobs: bestiaryMobType[];
  };
  kuudra: {
    name: string;
    texture: string;
    mobs: bestiaryMobType[];
  };
  fishing: {
    fishing: {
      name: string;
      texture: string;
      mobs: bestiaryMobType[];
    };
    lava: {
      name: string;
      texture: string;
      mobs: bestiaryMobType[];
    };
    spooky_festival: {
      name: string;
      texture: string;
      mobs: bestiaryMobType[];
    };
    fishing_festival: {
      name: string;
      texture: string;
      mobs: bestiaryMobType[];
    };
    winter: {
      name: string;
      texture: string;
      mobs: bestiaryMobType[];
    };
  };
  catacombs: {
    name: string;
    texture: string;
    mobs: bestiaryMobType[];
  };
  comMONTEZUMA?: any;
};
