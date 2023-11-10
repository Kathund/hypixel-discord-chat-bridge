//CREDIT: https://github.com/SkyCrypt/SkyCryptWebsite (Modified)
import { maxLevels, catacombs, normal, runecrafting, social } from './xp_tables';
import { SkillCalcResult } from '../../src/types/global';

export const calcSkill = (skill: string, experience: number): SkillCalcResult => {
  let table = 'normal';
  if (skill === 'runecrafting') table = 'runecrafting';
  if (skill === 'social') table = 'social';
  if (skill === 'dungeoneering') table = 'catacombs';

  let xpTable = normal;
  if (table === 'dungeoneering') xpTable = catacombs;
  else if (table === 'normal') xpTable = normal;
  else if (table === 'social') xpTable = social;
  else if (table === 'runecrafting') xpTable = runecrafting;

  if (experience <= 0) {
    return {
      totalXp: 0,
      xp: 0,
      level: 0,
      xpCurrent: 0,
      xpForNext: xpTable[0],
      progress: 0,
      levelWithProgress: 0,
    };
  }
  let xp = 0;
  let level = 0;
  let xpForNext = 0;
  let progress = 0;
  let maxLevel = 0;

  if (maxLevels[skill]) maxLevel = maxLevels[skill];

  for (let i = 1; i <= maxLevel; i++) {
    xp += xpTable[i - 1];

    if (xp > experience) {
      xp -= xpTable[i - 1];
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
    xpForNext = Math.ceil(xpTable[level] || 200000000);
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
