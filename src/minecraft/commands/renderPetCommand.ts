import { getRarityColor, formatUsername } from '../../contracts/helperFunctions';
import { getLatestProfile } from '../../../API/functions/getLatestProfile';
import { minecraftCommand } from '../../contracts/minecraftCommand';
import { uploadImage } from '../../contracts/API/imgurAPI';
import { renderLore } from '../../contracts/renderItem';
import { getPets } from '../../../API/stats/pets';

export default class PetCommand extends minecraftCommand {
  name: string;
  aliases: string[];
  description: string;
  options: { name: string; description: string; required: boolean }[];
  constructor(minecraft: any) {
    super(minecraft);

    this.name = 'pet';
    this.aliases = ['pets'];
    this.description = 'Renders active pet of specified user.';
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

      username = formatUsername(username, data.profileData?.game_mode);

      const profile = getPets(data.profile);

      const pet = profile.pets.find((pet: any) => pet.active === true);

      if (pet === undefined) {
        return this.send(`/gc ${username} does not have pet equipped.`);
      }

      const renderedItem = await renderLore(
        `§7[Lvl ${pet.level}] §${getRarityColor(pet.tier)}${pet.display_name}`,
        pet.lore
      );

      const upload = await uploadImage(renderedItem);

      return this.send(`/gc ${username}'s Active Pet: ${upload.data.link ?? 'Something went Wrong..'}`);
    } catch (error) {
      console.log(error);
      this.send(`/gc [ERROR] ${error}`);
    }
  }
}
