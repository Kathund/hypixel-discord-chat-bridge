export type Category = {
  name: string;
  mobs: Mob[];
  familiesCompleted: number;
  familiesUnlocked: number;
  totalFamilies: number;
  familyTiers: number;
  maxFamilyTiers: number;
};

export type Mob = { name: string; kills: number; nextTierKills: number; nextTier: number; maxKills: number; tier: number; maxTier: number };

export type Bestiary = {
  level: number;
  maxLevel: number;
  familiesUnlocked: number;
  familiesCompleted: number;
  totalFamilies: number;
  familyTiers: number;
  maxFamilyTiers: number;
  categories: Record<string, Category>;
};
