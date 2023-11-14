import { skyblockSlayers, skyblockSlayer } from '../../src/types/global';
import { slayer as slayerTable } from '../constants/xp_tables';

export function getSlayer(
  profile: any,
  slayer: 'zombie' | 'spider' | 'wolf' | 'enderman' | 'blaze' | 'vampire'
): skyblockSlayer {
  const slayers = profile?.slayer_bosses?.[slayer];
  const experience = slayers?.xp || 0;
  if (experience <= 0) {
    return {
      xp: 0,
      totalKills: 0,
      level: 0,
      xpForNext: slayerTable[slayer][0],
      progress: 0,
      kills: {},
    };
  }

  let level = 0;
  let xpForNext = 0;
  let progress = 0;
  const maxLevel = 9;

  for (let i = 0; i < slayerTable[slayer].length; i++) {
    if (slayerTable[slayer][i] <= experience) {
      level = i + 1;
    }
  }

  if (level < maxLevel) {
    xpForNext = Math.ceil(slayerTable[slayer][level]);
  }

  progress = level >= maxLevel ? 0 : Math.max(0, Math.min(experience / xpForNext, 1));

  const kills: any = {};
  let total = 0;
  if (slayer === 'zombie') kills[5] = 0;
  for (let i = 0; i < Object.keys(slayers).length; i++) {
    if (Object.keys(slayers)[i].startsWith('boss_kills_tier_')) {
      // This indeed looks pretty bad I know... (kills[boss tier number])
      total += (Object.values as any)(slayers)[i];
      kills[Number(Object.keys(slayers)[i].charAt(Object.keys(slayers)[i].length - 1)) + 1] = Object.values(slayers)[i];
    }
  }

  return {
    xp: experience,
    totalKills: total,
    level,
    xpForNext,
    progress,
    kills,
  };
}

export const getSlayers = (profile: any): skyblockSlayers => {
  return {
    zombie: getSlayer(profile, 'zombie'),
    spider: getSlayer(profile, 'spider'),
    wolf: getSlayer(profile, 'wolf'),
    enderman: getSlayer(profile, 'enderman'),
    blaze: getSlayer(profile, 'blaze'),
    vampire: getSlayer(profile, 'vampire'),
  };
};
