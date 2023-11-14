import { LilyDungeons, LilySkills, LilySlayer } from '../../src/types/global';
import { calculateTotalSenitherWeight } from '../constants/weight';
import { getDungeons } from './dungeons';
import { getSlayers } from './slayer';
import { getSkills } from './skills';
import LilyWeight from 'lilyweight';

export const getWeight = (profile: any) => {
  const { skills_levels, skills_experience } = formatLilySkills(getSkills(profile)) as LilySkills;
  const { catacombs_experience, catacombs, master_mode } = formatLilyDungeons(
    getDungeons(null, profile)
  ) as LilyDungeons;
  const { slayer_experience } = formatLilySlayer(getSlayers(profile)) as LilySlayer;

  const lily = LilyWeight.getWeightRaw(
    skills_levels as number[],
    skills_experience as number[],
    catacombs as {
      '0': number;
      '1': number;
      '2': number;
      '3': number;
      '4': number;
      '5': number;
      '6': number;
      '7': number;
    },
    master_mode as { '1': number; '2': number; '3': number; '4': number; '5': number; '6': number; '7': number },
    catacombs_experience as number,
    slayer_experience as number[]
  );

  const senither = calculateTotalSenitherWeight(profile);
  return {
    senither: {
      total:
        (senither.skills.farming?.weight ?? 0) +
        (senither.skills.mining?.weight ?? 0) +
        (senither.skills.combat?.weight ?? 0) +
        (senither.skills.foraging?.weight ?? 0) +
        (senither.skills.fishing?.weight ?? 0) +
        (senither.skills.enchanting?.weight ?? 0) +
        (senither.skills.alchemy?.weight ?? 0) +
        (senither.skills.taming?.weight ?? 0) +
        (senither.slayer.revenant?.weight ?? 0) +
        (senither.slayer.tarantula?.weight ?? 0) +
        (senither.slayer.sven?.weight ?? 0) +
        (senither.slayer.enderman?.weight ?? 0) +
        (senither.dungeons.catacombs?.weight ?? 0) +
        (senither.dungeons.classes.healer?.weight ?? 0) +
        (senither.dungeons.classes.mage?.weight ?? 0) +
        (senither.dungeons.classes.berserk?.weight ?? 0) +
        (senither.dungeons.classes.archer?.weight ?? 0) +
        (senither.dungeons.classes.tank?.weight ?? 0) +
        (senither.skills.farming?.weight_overflow ?? 0) +
        (senither.skills.mining?.weight_overflow ?? 0) +
        (senither.skills.combat?.weight_overflow ?? 0) +
        (senither.skills.foraging?.weight_overflow ?? 0) +
        (senither.skills.fishing?.weight_overflow ?? 0) +
        (senither.skills.enchanting?.weight_overflow ?? 0) +
        (senither.skills.alchemy?.weight_overflow ?? 0) +
        (senither.skills.taming?.weight_overflow ?? 0) +
        (senither.slayer.revenant?.weight_overflow ?? 0) +
        (senither.slayer.tarantula?.weight_overflow ?? 0) +
        (senither.slayer.sven?.weight_overflow ?? 0) +
        (senither.slayer.enderman?.weight_overflow ?? 0) +
        (senither.dungeons.catacombs?.weight_overflow ?? 0) +
        (senither.dungeons.classes.healer?.weight_overflow ?? 0) +
        (senither.dungeons.classes.mage?.weight_overflow ?? 0) +
        (senither.dungeons.classes.berserk?.weight_overflow ?? 0) +
        (senither.dungeons.classes.archer?.weight_overflow ?? 0) +
        (senither.dungeons.classes.tank?.weight_overflow ?? 0),
      weight:
        (senither.skills.farming?.weight ?? 0) +
        (senither.skills.mining?.weight ?? 0) +
        (senither.skills.combat?.weight ?? 0) +
        (senither.skills.foraging?.weight ?? 0) +
        (senither.skills.fishing?.weight ?? 0) +
        (senither.skills.enchanting?.weight ?? 0) +
        (senither.skills.alchemy?.weight ?? 0) +
        (senither.skills.taming?.weight ?? 0) +
        (senither.slayer.revenant?.weight ?? 0) +
        (senither.slayer.tarantula?.weight ?? 0) +
        (senither.slayer.sven?.weight ?? 0) +
        (senither.slayer.enderman?.weight ?? 0) +
        (senither.dungeons.catacombs?.weight ?? 0) +
        (senither.dungeons.classes.healer?.weight ?? 0) +
        (senither.dungeons.classes.mage?.weight ?? 0) +
        (senither.dungeons.classes.berserk?.weight ?? 0) +
        (senither.dungeons.classes.archer?.weight ?? 0) +
        (senither.dungeons.classes.tank?.weight ?? 0),
      weight_overflow:
        (senither.skills.farming?.weight_overflow ?? 0) +
        (senither.skills.mining?.weight_overflow ?? 0) +
        (senither.skills.combat?.weight_overflow ?? 0) +
        (senither.skills.foraging?.weight_overflow ?? 0) +
        (senither.skills.fishing?.weight_overflow ?? 0) +
        (senither.skills.enchanting?.weight_overflow ?? 0) +
        (senither.skills.alchemy?.weight_overflow ?? 0) +
        (senither.skills.taming?.weight_overflow ?? 0),
      skills: {
        farming: {
          total: (senither.skills.farming?.weight ?? 0) + (senither.skills.farming?.weight_overflow ?? 0),
          weight: senither.skills.farming?.weight ?? 0,
          weight_overflow: senither.skills.farming?.weight_overflow ?? 0,
        },
        mining: {
          total: (senither.skills.mining?.weight ?? 0) + (senither.skills.mining?.weight_overflow ?? 0),
          weight: senither.skills.mining?.weight ?? 0,
          weight_overflow: senither.skills.mining?.weight_overflow ?? 0,
        },
        combat: {
          total: (senither.skills.combat?.weight ?? 0) + (senither.skills.combat?.weight_overflow ?? 0),
          weight: senither.skills.combat?.weight ?? 0,
          weight_overflow: senither.skills.combat?.weight_overflow ?? 0,
        },
        foraging: {
          total: (senither.skills.foraging?.weight ?? 0) + (senither.skills.foraging?.weight_overflow ?? 0),
          weight: senither.skills.foraging?.weight ?? 0,
          weight_overflow: senither.skills.foraging?.weight_overflow ?? 0,
        },
        fishing: {
          total: (senither.skills.fishing?.weight ?? 0) + (senither.skills.fishing?.weight_overflow ?? 0),
          weight: senither.skills.fishing?.weight ?? 0,
          weight_overflow: senither.skills.fishing?.weight_overflow ?? 0,
        },
        enchanting: {
          total: (senither.skills.enchanting?.weight ?? 0) + (senither.skills.enchanting?.weight_overflow ?? 0),
          weight: senither.skills.enchanting?.weight ?? 0,
          weight_overflow: senither.skills.enchanting?.weight_overflow ?? 0,
        },
        alchemy: {
          total: (senither.skills.alchemy?.weight ?? 0) + (senither.skills.alchemy?.weight_overflow ?? 0),
          weight: senither.skills.alchemy?.weight ?? 0,
          weight_overflow: senither.skills.alchemy?.weight_overflow ?? 0,
        },
        taming: {
          total: (senither.skills.taming?.weight ?? 0) + (senither.skills.taming?.weight_overflow ?? 0),
          weight: senither.skills.taming?.weight ?? 0,
          weight_overflow: senither.skills.taming?.weight_overflow ?? 0,
        },
      },
      slayer: {
        total:
          (senither.slayer.revenant?.weight ?? 0) +
          (senither.slayer.revenant?.weight_overflow ?? 0) +
          (senither.slayer.tarantula?.weight ?? 0) +
          (senither.slayer.tarantula?.weight_overflow ?? 0) +
          (senither.slayer.sven?.weight ?? 0) +
          (senither.slayer.sven?.weight_overflow ?? 0) +
          (senither.slayer.enderman?.weight ?? 0) +
          (senither.slayer.enderman?.weight_overflow ?? 0),
        weight:
          (senither.slayer.revenant?.weight ?? 0) +
          (senither.slayer.tarantula?.weight ?? 0) +
          (senither.slayer.sven?.weight ?? 0) +
          (senither.slayer.enderman?.weight ?? 0),
        weight_overflow:
          (senither.slayer.revenant?.weight_overflow ?? 0) +
          (senither.slayer.tarantula?.weight_overflow ?? 0) +
          (senither.slayer.sven?.weight_overflow ?? 0) +
          (senither.slayer.enderman?.weight_overflow ?? 0),
        slayer: {
          revenant: {
            total: (senither.slayer.revenant?.weight ?? 0) + (senither.slayer.revenant?.weight_overflow ?? 0),
            weight: senither.slayer.revenant?.weight ?? 0,
            weight_overflow: senither.slayer.revenant?.weight_overflow ?? 0,
          },
          tarantula: {
            total: (senither.slayer.tarantula?.weight ?? 0) + (senither.slayer.tarantula?.weight_overflow ?? 0),
            weight: senither.slayer.tarantula?.weight ?? 0,
            weight_overflow: senither.slayer.tarantula?.weight_overflow ?? 0,
          },
          sven: {
            total: (senither.slayer.sven?.weight ?? 0) + (senither.slayer.sven?.weight_overflow ?? 0),
            weight: senither.slayer.sven?.weight ?? 0,
            weight_overflow: senither.slayer.sven?.weight_overflow ?? 0,
          },
          enderman: {
            total: (senither.slayer.enderman?.weight ?? 0) + (senither.slayer.enderman?.weight_overflow ?? 0),
            weight: senither.slayer.enderman?.weight ?? 0,
            weight_overflow: senither.slayer.enderman?.weight_overflow ?? 0,
          },
        },
      },
      dungeons: {
        total:
          (senither.dungeons.catacombs?.weight ?? 0) +
          (senither.dungeons.catacombs?.weight_overflow ?? 0) +
          (senither.dungeons.classes.healer?.weight ?? 0) +
          (senither.dungeons.classes.healer?.weight_overflow ?? 0) +
          (senither.dungeons.classes.mage?.weight ?? 0) +
          (senither.dungeons.classes.mage?.weight_overflow ?? 0) +
          (senither.dungeons.classes.berserk?.weight ?? 0) +
          (senither.dungeons.classes.berserk?.weight_overflow ?? 0) +
          (senither.dungeons.classes.archer?.weight ?? 0) +
          (senither.dungeons.classes.archer?.weight_overflow ?? 0) +
          (senither.dungeons.classes.tank?.weight ?? 0) +
          (senither.dungeons.classes.tank?.weight_overflow ?? 0),
        weight:
          (senither.dungeons.catacombs?.weight ?? 0) +
          (senither.dungeons.classes.healer?.weight ?? 0) +
          (senither.dungeons.classes.mage?.weight ?? 0) +
          (senither.dungeons.classes.berserk?.weight ?? 0) +
          (senither.dungeons.classes.archer?.weight ?? 0) +
          (senither.dungeons.classes.tank?.weight ?? 0),
        weight_overflow:
          (senither.dungeons.catacombs?.weight_overflow ?? 0) +
          (senither.dungeons.classes.healer?.weight_overflow ?? 0) +
          (senither.dungeons.classes.mage?.weight_overflow ?? 0) +
          (senither.dungeons.classes.berserk?.weight_overflow ?? 0) +
          (senither.dungeons.classes.archer?.weight_overflow ?? 0) +
          (senither.dungeons.classes.tank?.weight_overflow ?? 0),
        catacombs: {
          total: (senither.dungeons.catacombs?.weight ?? 0) + (senither.dungeons.catacombs?.weight_overflow ?? 0),
          weight: senither.dungeons.catacombs?.weight ?? 0,
          weight_overflow: senither.dungeons.catacombs?.weight_overflow ?? 0,
        },
        classes: {
          healer: {
            total:
              (senither.dungeons.classes.healer?.weight ?? 0) +
              (senither.dungeons.classes.healer?.weight_overflow ?? 0),
            weight: senither.dungeons.classes.healer?.weight ?? 0,
            weight_overflow: senither.dungeons.classes.healer?.weight_overflow ?? 0,
          },
          mage: {
            total:
              (senither.dungeons.classes.mage?.weight ?? 0) + (senither.dungeons.classes.mage?.weight_overflow ?? 0),
            weight: senither.dungeons.classes.mage?.weight ?? 0,
            weight_overflow: senither.dungeons.classes.mage?.weight_overflow ?? 0,
          },
          berserk: {
            total:
              (senither.dungeons.classes.berserk?.weight ?? 0) +
              (senither.dungeons.classes.berserk?.weight_overflow ?? 0),
            weight: senither.dungeons.classes.berserk?.weight ?? 0,
            weight_overflow: senither.dungeons.classes.berserk?.weight_overflow ?? 0,
          },
          archer: {
            total:
              (senither.dungeons.classes.archer?.weight ?? 0) +
              (senither.dungeons.classes.archer?.weight_overflow ?? 0),
            weight: senither.dungeons.classes.archer?.weight ?? 0,
            weight_overflow: senither.dungeons.classes.archer?.weight_overflow ?? 0,
          },
          tank: {
            total:
              (senither.dungeons.classes.tank?.weight ?? 0) + (senither.dungeons.classes.tank?.weight_overflow ?? 0),
            weight: senither.dungeons.classes.tank?.weight ?? 0,
            weight_overflow: senither.dungeons.classes.tank?.weight_overflow ?? 0,
          },
        },
      },
    },
    lily: {
      total: lily.total,
      skills: {
        total: lily.skill.base + lily.skill.overflow,
        base: lily.skill.base,
        overflow: lily.skill.overflow,
      },
      slayer: {
        total: lily.slayer,
      },
      catacombs: {
        total: lily.catacombs.completion.base + lily.catacombs.completion.master + lily.catacombs.experience,
        completion: {
          base: lily.catacombs.completion.base,
          master: lily.catacombs.completion.master,
        },
        experience: lily.catacombs.experience,
      },
    },
  };
};

function formatLilySkills(skills: any): LilySkills {
  //  enchanting, taming, alchemy, mining, farming, foraging, combat, fishing.
  const skillSort = ['enchanting', 'taming', 'alchemy', 'mining', 'farming', 'foraging', 'combat', 'fishing'];
  const whitelistedSkills = Object.keys(skills).filter(
    (skill) => !['runecrafting', 'social', 'carpentry'].includes(skill)
  );
  const skills_levels = whitelistedSkills
    .sort((a, b) => skillSort.indexOf(a) - skillSort.indexOf(b))
    .map((skill) => skills[skill].level);
  const skills_experience = whitelistedSkills
    .sort((a, b) => skillSort.indexOf(a) - skillSort.indexOf(b))
    .map((skill) => skills[skill].totalXp);

  return { skills_levels, skills_experience };
}

function formatLilyDungeons(dungeons: any): LilyDungeons {
  const catacombs_experience = dungeons.catacombs?.skill?.totalXp || 0;
  const catacombs = {};
  for (const floor of Object.keys(dungeons.catacombs?.floors || {})) {
    const formattedFloor = floor === 'entrance' ? 0 : floor.split('_')[1];
    Object.assign(catacombs, { [formattedFloor]: dungeons.catacombs.floors[floor].completions });
  }

  const master_mode = {};
  for (const floor of Object.keys(dungeons.catacombs?.master_mode_floors || {})) {
    Object.assign(master_mode, { [floor.split('_')[1]]: dungeons.catacombs.master_mode_floors[floor].completions });
  }

  return { catacombs, master_mode, catacombs_experience };
}

function formatLilySlayer(slayer: any): LilySlayer {
  const slayerSort = ['zombie', 'spider', 'wolf', 'enderman', 'blaze'];
  const slayer_experience = Object.keys(slayer)
    .sort((a, b) => slayerSort.indexOf(a) - slayerSort.indexOf(b))
    .map((type) => slayer[type].xp);

  return { slayer_experience };
}
