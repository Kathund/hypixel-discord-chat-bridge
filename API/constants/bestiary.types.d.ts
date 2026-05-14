export type Island = { name: string; mobs: Mob[] };

export type Mob = { name: string; cap: number; mobs: string[]; bracket: number };

export type RawMob = { name: string; item?: string; skullOwner?: string; texture?: string; cap: number; mobs: string[]; bracket: number };

export type BestiaryConstant = { brackets: Record<string, number[]>; islands: Record<string, Island> };
