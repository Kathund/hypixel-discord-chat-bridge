import MinecraftCommand from "../../contracts/MinecraftCommand.js";
import { getGarden } from "../../../API/stats/garden.js";
import { getLatestProfile } from "../../../API/functions/getLatestProfile.js";

class GardenCommand extends MinecraftCommand {
  /** @param {import("minecraft-protocol").Client} minecraft */
  constructor(minecraft) {
    super(minecraft);

    this.name = "garden";
    this.aliases = [];
    this.description = "Skyblock Garden Stats of specified user.";
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
    try {
      // CREDITS: by @Kathund (https://github.com/Kathund)
      const args = this.getArgs(message);
      player = args[0] || player;

      const { username, garden } = await getLatestProfile(player, { garden: true });
      if (!garden) {
        return this.send(`[ERROR] ${username} does not have a garden.`);
      }

      const gardenData = getGarden(garden);
      if (!gardenData) {
        return this.send(`[ERROR] ${username} does not have a garden.`);
      }

      this.send(
        `${username}'s Garden ${gardenData.level.level} | Crop Milestones: Wheat: ${gardenData.cropMilesstone.wheat.level} | Carrot: ${gardenData.cropMilesstone.carrot.level} | Cane: ${gardenData.cropMilesstone.sugarCane.level} | Potato: ${gardenData.cropMilesstone.potato.level} | Wart: ${gardenData.cropMilesstone.netherWart.level} | Pumpkin: ${gardenData.cropMilesstone.pumpkin.level} | Melon: ${gardenData.cropMilesstone.melon.level} | Mushroom: ${gardenData.cropMilesstone.mushroom.level} | Cocoa: ${gardenData.cropMilesstone.cocoaBeans.level} | Cactus: ${gardenData.cropMilesstone.cactus.level}`
      );
    } catch (error) {
      console.log(error);
      this.send(`[ERROR] ${error}`);
    }
  }
}

export default GardenCommand;
