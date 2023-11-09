import { BESTIARY_BRACKETS, BESTIARY } from '../constants/bestiary';

function formatBestiaryMobs(userProfile: any, mobs: any) {
  const output = [];
  for (const mob of mobs) {
    const mobBracket = (BESTIARY_BRACKETS as any)[mob.bracket];

    const totalKills = mob.mobs.reduce((acc: any, cur: any) => {
      return acc + (userProfile.bestiary.kills[cur] ?? 0);
    }, 0);

    const maxKills = mob.cap;
    const nextTierKills = mobBracket.find((tier: any) => totalKills < tier && tier <= maxKills);
    const tier = nextTierKills ? mobBracket.indexOf(nextTierKills) : mobBracket.indexOf(maxKills) + 1;

    output.push({
      name: mob.name,
      kills: totalKills,
      nextTierKills: nextTierKills ?? null,
      maxKills: maxKills,
      tier: tier,
      maxTier: mobBracket.indexOf(maxKills) + 1,
    });
  }

  return output;
}

export const getBestiary = (userProfile: any) => {
  try {
    if (userProfile.bestiary?.kills === undefined) {
      return null;
    }

    const output: any = {};
    let tiersUnlocked = 0,
      totalTiers = 0;
    for (const [category, data] of Object.entries(BESTIARY)) {
      const { name, mobs }: any = data;
      output[category] = { name };

      if (category === 'fishing') {
        for (const [key, value] of Object.entries(data)) {
          if (key === 'name') continue;

          output[category][key] = {
            name: value.name,
          };

          output[category][key].mobs = formatBestiaryMobs(userProfile, value.mobs);

          tiersUnlocked += output[category][key].mobs.reduce((acc: any, cur: any) => acc + cur.tier, 0);
          totalTiers += output[category][key].mobs.reduce((acc: any, cur: any) => acc + cur.maxTier, 0);
          output[category][key].mobsUnlocked = output[category][key].mobs.length;
          output[category][key].mobsMaxed = output[category][key].mobs.filter(
            (mob: any) => mob.tier === mob.maxTier
          ).length;
        }
      } else {
        output[category].mobs = formatBestiaryMobs(userProfile, mobs);
        output[category].mobsUnlocked = output[category].mobs.length;
        output[category].mobsMaxed = output[category].mobs.filter((mob: any) => mob.tier === mob.maxTier).length;

        tiersUnlocked += output[category].mobs.reduce((acc: any, cur: any) => acc + cur.tier, 0);
        totalTiers += output[category].mobs.reduce((acc: any, cur: any) => acc + cur.maxTier, 0);
      }
    }

    return {
      categories: output,
      tiersUnlocked,
      totalTiers,
      milestone: tiersUnlocked / 10,
      maxMilestone: totalTiers / 10,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};
