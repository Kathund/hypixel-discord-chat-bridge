import { formatNumber, formatUsername } from '../../contracts/helperFunctions';
import { getLatestProfile } from '../../../API/functions/getLatestProfile';
import { minecraftCommand } from '../../contracts/minecraftCommand';
import { getTalismans } from '../../../API/stats/talismans';
import { getDungeons } from '../../../API/stats/dungeons';
import { getSlayers } from '../../../API/stats/slayer';
import { getSkills } from '../../../API/stats/skills';
import { getWeight } from '../../../API/stats/weight';
import { getNetworth } from 'skyhelper-networth';

export default class SkyblockCommand extends minecraftCommand {
  name: string;
  aliases: string[];
  description: string;
  options: { name: string; description: string; required: boolean }[];
  constructor(minecraft: any) {
    super(minecraft);

    this.name = 'skyblock';
    this.aliases = ['stats', 'sb'];
    this.description = 'Skyblock Stats of specified user.';
    this.options = [
      {
        name: 'username',
        description: 'Minecraft username',
        required: false,
      },
    ];
  }

  async onCommand(username: any, message: any) {
    try {
      username = this.getArgs(message)[0] || username;

      const data = await getLatestProfile(username);
      username = formatUsername(username, data.profileData.game_mode);

      const [skills, slayer, networth, weight, dungeons, talismans] = await Promise.all([
        getSkills(data.profile),
        getSlayers(data.profile),
        getNetworth(data.profile, data.profileData?.banking?.balance || 0, {
          cache: true,
          onlyNetworth: true,
        }),
        getWeight(data.profile),
        getDungeons(data.player, data.profile),
        getTalismans(data.profile),
      ]);

      const senitherWeight = Math.floor(weight?.senither?.total || 0).toLocaleString();
      const lilyWeight = Math.floor(weight?.lily?.total || 0).toLocaleString();
      const skillAverage = (
        Object.keys(skills)
          .filter((skill) => !['runecrafting', 'social'].includes(skill))
          .map((skill) => (skills as any)[skill].level)
          .reduce((a, b) => a + b, 0) /
        (Object.keys(skills).length - 2)
      ).toFixed(1);
      const slayerXp = Object.values(slayer)
        .map((slayerData) => slayerData.xp)
        .reduce((a, b) => a + b, 0)
        .toLocaleString();
      const catacombsLevel = (dungeons as any).catacombs.skill.level;
      const classAverage =
        Object.values((dungeons as any).classes)
          .map((value) => (value as any).level)
          .reduce((a, b) => a + b, 0) / Object.keys((dungeons as any).classes).length;
      const networthValue = formatNumber(networth.networth);
      const talismanCount = talismans?.total ?? 0;
      const recombobulatedCount = talismans?.recombed ?? 0;
      const enrichmentCount = talismans?.enriched ?? 0;

      this.send(
        `/gc ${username}'s Level: ${
          data.profile.leveling?.experience ? data.profile.leveling.experience / 100 : 0
        } | Senither Weight: ${senitherWeight} | Lily Weight: ${lilyWeight} | Skill Average: ${skillAverage} | Slayer: ${slayerXp} | Catacombs: ${catacombsLevel} | Class Average: ${classAverage} | Networth: ${networthValue} | Accessories: ${talismanCount} | Recombobulated: ${recombobulatedCount} | Enriched: ${enrichmentCount}`
      );
    } catch (error) {
      this.send(`/gc [ERROR] ${error}`);
    }
  }
}
