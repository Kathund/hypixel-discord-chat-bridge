import MinecraftCommand from "../../contracts/MinecraftCommand.js";
import { formatNumber, titleCase } from "../../contracts/helperFunctions.js";
import { getEssence } from "../../../API/stats/essence.js";
import { getLatestProfile } from "../../../API/functions/getLatestProfile.js";

class EssenceCommand extends MinecraftCommand {
  /** @param {import("minecraft-protocol").Client} minecraft */
  constructor(minecraft) {
    super(minecraft);

    this.name = "essence";
    this.aliases = [];
    this.description = "Skyblock Dungeons Stats of specified user.";
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

      const { username, profile, profileData } = await getLatestProfile(player);

      const essence = getEssence(profile);
      if (essence === null) {
        throw new Error(`${username} has never unlocked essence on ${profileData.cute_name}.`);
      }

      const essenceString = Object.entries(essence)
        .map(([key, value]) => `${titleCase(key)}: ${formatNumber(value)}`)
        .join(", ");

      this.send(`${username}'s Essence: ${essenceString}`);
    } catch (error) {
      console.error(error);

      this.send(`[ERROR] ${error}`);
    }
  }
}

export default EssenceCommand;
