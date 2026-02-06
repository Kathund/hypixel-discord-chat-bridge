import MinecraftCommand from "../../contracts/MinecraftCommand.js";
import { decodeData } from "../../../API/utils/nbt.js";
import { getLatestProfile } from "../../../API/functions/getLatestProfile.js";
import { renderLore } from "../../contracts/renderItem.js";
import { uploadImage } from "../../contracts/API/imgurAPI.js";

class ArmorCommand extends MinecraftCommand {
  /** @param {import("minecraft-protocol").Client} minecraft */
  constructor(minecraft) {
    super(minecraft);

    this.name = "armor";
    this.aliases = [];
    this.description = "Renders armor of specified user.";
    this.options = [
      {
        name: "username",
        description: "Minecraft username",
        required: false
      }
    ];
  }

  /**
   * @param {string} player
   * @param {string} message
   * */
  async onCommand(player, message) {
    // CREDITS: by @Altpapier (https://github.com/Altpapier/hypixel-discord-guild-bridge/blob/master/ingameCommands/render.js)
    try {
      const args = this.getArgs(message);
      player = args[0] || player;

      const { username, profile } = await getLatestProfile(player);

      if (profile.inventory?.inv_armor?.data === undefined) {
        return this.send("This player has an Inventory API off.");
      }

      const inventoryData = (await decodeData(Buffer.from(profile.inventory.inv_armor.data, "base64"))).i;

      // @ts-ignore
      if (inventoryData === undefined || inventoryData.filter((x) => JSON.stringify(x) === JSON.stringify({})).length === 4) {
        return this.send(`${username} has no armor equipped.`);
      }

      for (const piece of Object.values(inventoryData)) {
        if (piece?.tag?.display?.Name === undefined || piece?.tag?.display?.Lore === undefined) {
          continue;
        }

        const Name = piece?.tag?.display?.Name;
        const Lore = piece?.tag?.display?.Lore;

        const renderedItem = renderLore(Name, Lore);
        if (renderedItem === null) {
          this.send("An error occured while rendering the item.");
          continue;
        }

        await uploadImage(renderedItem);
      }

      this.send(`${username}'s armor has been rendered, check Discord for the images.`);
    } catch (error) {
      this.send(`[ERROR] ${error}`);
    }
  }
}

export default ArmorCommand;
