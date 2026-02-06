import MinecraftCommand from "../../contracts/MinecraftCommand.js";
import { getForge } from "../../../API/stats/hotm.js";
import { getLatestProfile } from "../../../API/functions/getLatestProfile.js";

class ForgeCommand extends MinecraftCommand {
  /** @param {import("minecraft-protocol").Client} minecraft */
  constructor(minecraft) {
    super(minecraft);

    this.name = "forge";
    this.aliases = [];
    this.description = "Skyblock Forge Info Stats of specified user.";
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
      const args = this.getArgs(message);
      player = args[0] || player;

      const { username, profile, profileData } = await getLatestProfile(player);

      const forge = getForge(profile);
      if (forge === null) {
        throw new Error(`${username} has never gone to Dwarven Mines on ${profileData.cute_name}.`);
      }

      if (forge.length === 0 || forge === null) {
        throw new Error(`${username} has no items in their forge.`);
      }

      const forgeItems = forge.map((item) => `${item.slot}: ${item.name} ${item.timeFinishedText}`);
      this.send(`${username}'s Forge: ${forgeItems.join(" | ")}`);
    } catch (error) {
      this.send(`[ERROR] ${error}`);
    }
  }
}

export default ForgeCommand;
