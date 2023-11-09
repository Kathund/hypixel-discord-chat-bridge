import { xpTables } from '../constants/xp_tables';

export const getSlayers = (profile: any) => {
  function getSlayer(slayer: any) {
    const slayers = profile?.slayer_bosses?.[slayer];
    const experience = slayers?.xp || 0;
    if (experience <= 0) {
      return {
        xp: 0,
        level: 0,
        xpForNext: (xpTables.slayer as any)[slayer][0],
        progress: 0,
        kills: {},
      };
    }

    let level = 0;
    let xpForNext = 0;
    let progress = 0;
    const maxLevel = 9;

    for (let i = 0; i < (xpTables.slayer as any)[slayer].length; i++) {
      if ((xpTables.slayer as any)[slayer][i] <= experience) {
        level = i + 1;
      }
    }

    if (level < maxLevel) {
      xpForNext = Math.ceil((xpTables.slayer as any)[slayer][level]);
    }

    progress = level >= maxLevel ? 0 : Math.max(0, Math.min(experience / xpForNext, 1));

    const kills = {};
    let total = 0;
    if (slayer === 'zombie') (kills as any)[5] = 0;
    for (let i = 0; i < Object.keys(slayers).length; i++) {
      if (Object.keys(slayers)[i].startsWith('boss_kills_tier_')) {
        // This indeed looks pretty bad I know... (kills[boss tier number])
        total += (Object.values as any)(slayers)[i];
        (kills as any)[Number(Object.keys(slayers)[i].charAt(Object.keys(slayers)[i].length - 1)) + 1] =
          Object.values(slayers)[i];
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

  return {
    zombie: getSlayer('zombie'),
    spider: getSlayer('spider'),
    wolf: getSlayer('wolf'),
    enderman: getSlayer('enderman'),
    blaze: getSlayer('blaze'),
    vampire: getSlayer('vampire'),
  };
};
