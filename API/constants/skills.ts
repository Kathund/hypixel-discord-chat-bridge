//CREDIT: https://github.com/SkyCrypt/SkyCryptWebsite (Modified)
import { xpTables } from './xp_tables';

export const calcSkill = (skill: any, experience: any) => {
  let table = 'normal';
  if (skill === 'runecrafting') table = 'runecrafting';
  if (skill === 'social') table = 'social';
  if (skill === 'dungeoneering') table = 'catacombs';

  if (experience <= 0) {
    return {
      totalXp: 0,
      xp: 0,
      level: 0,
      xpCurrent: 0,
      xpForNext: (xpTables as any)[table][0],
      progress: 0,
    };
  }
  let xp = 0;
  let level = 0;
  let xpForNext = 0;
  let progress = 0;
  let maxLevel = 0;

  if ((xpTables.max_levels as any)[skill]) maxLevel = (xpTables.max_levels as any)[skill];

  for (let i = 1; i <= maxLevel; i++) {
    xp += (xpTables as any)[table][i - 1];

    if (xp > experience) {
      xp -= (xpTables as any)[table][i - 1];
    } else {
      if (i <= maxLevel) level = i;
    }
  }

  if (skill === 'dungeoneering') {
    level += Math.floor((experience - xp) / 200_000_000);
    xp += Math.floor((experience - xp) / 200_000_000) * 200_000_000;

    xpForNext = 200000000;
  }

  const xpCurrent = Math.floor(experience - xp);

  const totalXp = experience;

  if (level < maxLevel) {
    xpForNext = Math.ceil((xpTables as any)[table][level] || 200000000);
  }

  progress = level >= maxLevel && skill !== 'dungeoneering' ? 0 : Math.max(0, Math.min(xpCurrent / xpForNext, 1));

  return {
    totalXp,
    xp,
    level,
    xpCurrent,
    xpForNext,
    progress,
    levelWithProgress: level + progress || 0,
  };
};
