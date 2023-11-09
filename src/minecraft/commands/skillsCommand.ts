import { getLatestProfile } from '../../../API/functions/getLatestProfile';
import { minecraftCommand } from '../../contracts/minecraftCommand';
import { formatUsername } from '../../contracts/helperFunctions';
import { getSkills } from '../../../API/stats/skills';

export class SkillsCommand extends minecraftCommand {
  name: string;
  aliases: string[];
  description: string;
  options: { name: string; description: string; required: boolean }[];
  constructor(minecraft: any) {
    super(minecraft);

    this.name = 'skills';
    this.aliases = ['skill', 'sa'];
    this.description = 'Skills and Skill Average of specified user.';
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

      username = formatUsername(username, data.profileData.cute_name);

      const profile = getSkills(data.profile);

      const skillAverage = (
        Object.keys(profile)
          .filter((skill) => !['runecrafting', 'social'].includes(skill))
          .map((skill) => (profile as any)[skill].levelWithProgress || 0)
          .reduce((a, b) => a + b, 0) /
        (Object.keys(profile).length - 2)
      ).toFixed(2);

      const skillsFormatted = Object.keys(profile)
        .map((skill) => {
          const level = Math.floor((profile as any)[skill].levelWithProgress ?? 0);
          const skillName = skill[0].toUpperCase() + skill[1];
          return `${level}${skillName}`;
        })
        .join(', ');

      this.send(`/gc ${username}'s Skill Average: ${skillAverage ?? 0} (${skillsFormatted})`);
    } catch (error) {
      this.send(`[ERROR] ${error}}`);
    }
  }
}
