import { calculateTotalSenitherWeight } from '../constants/weight';
import { getDungeons } from './dungeons';
import { getSlayers } from './slayer';
import { getSkills } from './skills';
import LilyWeight from 'lilyweight';

export const getWeight = (profile: any) => {
  const { skills_levels, skills_experience } = formatLilySkills(getSkills(profile));
  const { catacombs_experience, catacombs, master_mode } = formatLilyDungeons(getDungeons(null, profile));
  const { slayer_experience } = formatLilySlayer(getSlayers(profile));

  const lily = LilyWeight.getWeightRaw(
    skills_levels as any,
    skills_experience as any,
    catacombs as any,
    master_mode as any,
    catacombs_experience as any,
    slayer_experience as any
  );

  const senither = calculateTotalSenitherWeight(profile);
  return {
    senither: {
      total:
        (senither.skills as any).farming.weight +
        (senither.skills as any).mining.weight +
        (senither.skills as any).combat.weight +
        (senither.skills as any).foraging.weight +
        (senither.skills as any).fishing.weight +
        (senither.skills as any).enchanting.weight +
        (senither.skills as any).alchemy.weight +
        (senither.skills as any).taming.weight +
        (senither.slayer as any).revenant.weight +
        (senither.slayer as any).tarantula.weight +
        (senither.slayer as any).sven.weight +
        (senither.slayer as any).enderman.weight +
        (senither.dungeons as any).catacombs.weight +
        (senither.dungeons as any).classes.healer.weight +
        (senither.dungeons as any).classes.mage.weight +
        (senither.dungeons as any).classes.berserk.weight +
        (senither.dungeons as any).classes.archer.weight +
        (senither.dungeons as any).classes.tank.weight +
        (senither.skills as any).farming.weight_overflow +
        (senither.skills as any).mining.weight_overflow +
        (senither.skills as any).combat.weight_overflow +
        (senither.skills as any).foraging.weight_overflow +
        (senither.skills as any).fishing.weight_overflow +
        (senither.skills as any).enchanting.weight_overflow +
        (senither.skills as any).alchemy.weight_overflow +
        (senither.skills as any).taming.weight_overflow +
        (senither.slayer as any).revenant.weight_overflow +
        (senither.slayer as any).tarantula.weight_overflow +
        (senither.slayer as any).sven.weight_overflow +
        (senither.slayer as any).enderman.weight_overflow +
        (senither.dungeons as any).catacombs.weight_overflow +
        (senither.dungeons as any).classes.healer.weight_overflow +
        (senither.dungeons as any).classes.mage.weight_overflow +
        (senither.dungeons as any).classes.berserk.weight_overflow +
        (senither.dungeons as any).classes.archer.weight_overflow +
        (senither.dungeons as any).classes.tank.weight_overflow,
      weight:
        (senither.skills as any).farming.weight +
        (senither.skills as any).mining.weight +
        (senither.skills as any).combat.weight +
        (senither.skills as any).foraging.weight +
        (senither.skills as any).fishing.weight +
        (senither.skills as any).enchanting.weight +
        (senither.skills as any).alchemy.weight +
        (senither.skills as any).taming.weight +
        (senither.slayer as any).revenant.weight +
        (senither.slayer as any).tarantula.weight +
        (senither.slayer as any).sven.weight +
        (senither.slayer as any).enderman.weight +
        (senither.dungeons as any).catacombs.weight +
        (senither.dungeons as any).classes.healer.weight +
        (senither.dungeons as any).classes.mage.weight +
        (senither.dungeons as any).classes.berserk.weight +
        (senither.dungeons as any).classes.archer.weight +
        (senither.dungeons as any).classes.tank.weight,
      weight_overflow:
        (senither.skills as any).farming.weight_overflow +
        (senither.skills as any).mining.weight_overflow +
        (senither.skills as any).combat.weight_overflow +
        (senither.skills as any).foraging.weight_overflow +
        (senither.skills as any).fishing.weight_overflow +
        (senither.skills as any).enchanting.weight_overflow +
        (senither.skills as any).alchemy.weight_overflow +
        (senither.skills as any).taming.weight_overflow,
      skills: {
        farming: {
          total: (senither.skills as any).farming.weight + (senither.skills as any).farming.weight_overflow,
          weight: (senither.skills as any).farming.weight,
          weight_overflow: (senither.skills as any).farming.weight_overflow,
        },
        mining: {
          total: (senither.skills as any).mining.weight + (senither.skills as any).mining.weight_overflow,
          weight: (senither.skills as any).mining.weight,
          weight_overflow: (senither.skills as any).mining.weight_overflow,
        },
        combat: {
          total: (senither.skills as any).combat.weight + (senither.skills as any).combat.weight_overflow,
          weight: (senither.skills as any).combat.weight,
          weight_overflow: (senither.skills as any).combat.weight_overflow,
        },
        foraging: {
          total: (senither.skills as any).foraging.weight + (senither.skills as any).foraging.weight_overflow,
          weight: (senither.skills as any).foraging.weight,
          weight_overflow: (senither.skills as any).foraging.weight_overflow,
        },
        fishing: {
          total: (senither.skills as any).fishing.weight + (senither.skills as any).fishing.weight_overflow,
          weight: (senither.skills as any).fishing.weight,
          weight_overflow: (senither.skills as any).fishing.weight_overflow,
        },
        enchanting: {
          total: (senither.skills as any).enchanting.weight + (senither.skills as any).enchanting.weight_overflow,
          weight: (senither.skills as any).enchanting.weight,
          weight_overflow: (senither.skills as any).enchanting.weight_overflow,
        },
        alchemy: {
          total: (senither.skills as any).alchemy.weight + (senither.skills as any).alchemy.weight_overflow,
          weight: (senither.skills as any).alchemy.weight,
          weight_overflow: (senither.skills as any).alchemy.weight_overflow,
        },
        taming: {
          total: (senither.skills as any).taming.weight + (senither.skills as any).taming.weight_overflow,
          weight: (senither.skills as any).taming.weight,
          weight_overflow: (senither.skills as any).taming.weight_overflow,
        },
      },
      slayer: {
        total:
          (senither.slayer as any).revenant.weight +
          (senither.slayer as any).revenant.weight_overflow +
          (senither.slayer as any).tarantula.weight +
          (senither.slayer as any).tarantula.weight_overflow +
          (senither.slayer as any).sven.weight +
          (senither.slayer as any).sven.weight_overflow +
          (senither.slayer as any).enderman.weight +
          (senither.slayer as any).enderman.weight_overflow,
        weight:
          (senither.slayer as any).revenant.weight +
          (senither.slayer as any).tarantula.weight +
          (senither.slayer as any).sven.weight +
          (senither.slayer as any).enderman.weight,
        weight_overflow:
          (senither.slayer as any).revenant.weight_overflow +
          (senither.slayer as any).tarantula.weight_overflow +
          (senither.slayer as any).sven.weight_overflow +
          (senither.slayer as any).enderman.weight_overflow,
        slayer: {
          revenant: {
            total: (senither.slayer as any).revenant.weight + (senither.slayer as any).revenant.weight_overflow,
            weight: (senither.slayer as any).revenant.weight,
            weight_overflow: (senither.slayer as any).revenant.weight_overflow,
          },
          tarantula: {
            total: (senither.slayer as any).tarantula.weight + (senither.slayer as any).tarantula.weight_overflow,
            weight: (senither.slayer as any).tarantula.weight,
            weight_overflow: (senither.slayer as any).tarantula.weight_overflow,
          },
          sven: {
            total: (senither.slayer as any).sven.weight + (senither.slayer as any).sven.weight_overflow,
            weight: (senither.slayer as any).sven.weight,
            weight_overflow: (senither.slayer as any).sven.weight_overflow,
          },
          enderman: {
            total: (senither.slayer as any).enderman.weight + (senither.slayer as any).enderman.weight_overflow,
            weight: (senither.slayer as any).enderman.weight,
            weight_overflow: (senither.slayer as any).enderman.weight_overflow,
          },
        },
      },
      dungeons: {
        total:
          (senither.dungeons as any).catacombs.weight +
          (senither.dungeons as any).catacombs.weight_overflow +
          (senither.dungeons as any).classes.healer.weight +
          (senither.dungeons as any).classes.healer.weight_overflow +
          (senither.dungeons as any).classes.mage.weight +
          (senither.dungeons as any).classes.mage.weight_overflow +
          (senither.dungeons as any).classes.berserk.weight +
          (senither.dungeons as any).classes.berserk.weight_overflow +
          (senither.dungeons as any).classes.archer.weight +
          (senither.dungeons as any).classes.archer.weight_overflow +
          (senither.dungeons as any).classes.tank.weight +
          (senither.dungeons as any).classes.tank.weight_overflow,
        weight:
          (senither.dungeons as any).catacombs.weight +
          (senither.dungeons as any).classes.healer.weight +
          (senither.dungeons as any).classes.mage.weight +
          (senither.dungeons as any).classes.berserk.weight +
          (senither.dungeons as any).classes.archer.weight +
          (senither.dungeons as any).classes.tank.weight,
        weight_overflow:
          (senither.dungeons as any).catacombs.weight_overflow +
          (senither.dungeons as any).classes.healer.weight_overflow +
          (senither.dungeons as any).classes.mage.weight_overflow +
          (senither.dungeons as any).classes.berserk.weight_overflow +
          (senither.dungeons as any).classes.archer.weight_overflow +
          (senither.dungeons as any).classes.tank.weight_overflow,
        catacombs: {
          total: (senither.dungeons as any).catacombs.weight + (senither.dungeons as any).catacombs.weight_overflow,
          weight: (senither.dungeons as any).catacombs.weight,
          weight_overflow: (senither.dungeons as any).catacombs.weight_overflow,
        },
        classes: {
          healer: {
            total:
              (senither.dungeons as any).classes.healer.weight +
              (senither.dungeons as any).classes.healer.weight_overflow,
            weight: (senither.dungeons as any).classes.healer.weight,
            weight_overflow: (senither.dungeons as any).classes.healer.weight_overflow,
          },
          mage: {
            total:
              (senither.dungeons as any).classes.mage.weight + (senither.dungeons as any).classes.mage.weight_overflow,
            weight: (senither.dungeons as any).classes.mage.weight,
            weight_overflow: (senither.dungeons as any).classes.mage.weight_overflow,
          },
          berserk: {
            total:
              (senither.dungeons as any).classes.berserk.weight +
              (senither.dungeons as any).classes.berserk.weight_overflow,
            weight: (senither.dungeons as any).classes.berserk.weight,
            weight_overflow: (senither.dungeons as any).classes.berserk.weight_overflow,
          },
          archer: {
            total:
              (senither.dungeons as any).classes.archer.weight +
              (senither.dungeons as any).classes.archer.weight_overflow,
            weight: (senither.dungeons as any).classes.archer.weight,
            weight_overflow: (senither.dungeons as any).classes.archer.weight_overflow,
          },
          tank: {
            total:
              (senither.dungeons as any).classes.tank.weight + (senither.dungeons as any).classes.tank.weight_overflow,
            weight: (senither.dungeons as any).classes.tank.weight,
            weight_overflow: (senither.dungeons as any).classes.tank.weight_overflow,
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

function formatLilySkills(skills: any) {
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

function formatLilyDungeons(dungeons: any) {
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

function formatLilySlayer(slayer: any) {
  const slayerSort = ['zombie', 'spider', 'wolf', 'enderman', 'blaze'];
  const slayer_experience = Object.keys(slayer)
    .sort((a, b) => slayerSort.indexOf(a) - slayerSort.indexOf(b))
    .map((type) => slayer[type].xp);

  return { slayer_experience };
}
