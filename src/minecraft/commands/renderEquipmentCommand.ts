import { decodeData, formatUsername } from '../../contracts/helperFunctions';
import { getLatestProfile } from '../../../API/functions/getLatestProfile';
import { minecraftCommand } from '../../contracts/minecraftCommand';
import { uploadImage } from '../../contracts/API/imgurAPI';
import { renderLore } from '../../contracts/renderItem';

export default class EquipmentCommand extends minecraftCommand {
  name: string;
  aliases: never[];
  description: string;
  options: { name: string; description: string; required: boolean }[];
  constructor(minecraft: any) {
    super(minecraft);

    this.name = 'equipment';
    this.aliases = [];
    this.description = 'Renders equipment of specified user.';
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

      const profile = await getLatestProfile(username);

      username = formatUsername(username, profile.profileData?.game_mode);

      if (profile.profile?.equippment_contents?.data === undefined) {
        return this.send(`/gc This player has an Inventory API off.`);
      }

      const { i: inventoryData } = await decodeData(Buffer.from(profile.profile.equippment_contents.data, 'base64'));

      let response = '';
      for (const piece of Object.values(inventoryData)) {
        if ((piece as any)?.tag?.display?.Name === undefined || (piece as any)?.tag?.display?.Lore === undefined) {
          continue;
        }

        const Name = (piece as any)?.tag?.display?.Name;
        const Lore = (piece as any)?.tag?.display?.Lore;

        const renderedItem = await renderLore(Name, Lore);

        const upload = await uploadImage(renderedItem);

        const link = upload.data.link;

        response += response.split(' | ').length == 4 ? link : `${link} | `;
      }

      this.send(`/gc ${username}'s Equipment: ${response}`);
    } catch (error) {
      this.send(`/gc [ERROR] ${error}`);
    }
  }
}
