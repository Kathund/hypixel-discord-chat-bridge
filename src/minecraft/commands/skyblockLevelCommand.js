import MinecraftCommand from "../../contracts/MinecraftCommand.js";
import { getLatestProfile } from "../../../API/functions/getLatestProfile.js";

class SkyBlockLevelCommand extends MinecraftCommand {
  /** @param {import("minecraft-protocol").Client} minecraft */
  constructor(minecraft) {
    super(minecraft);

    this.name = "level";
    this.aliases = ["lvl"];
    this.description = "Skyblock Level of specified user.";
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

      const { username, profile } = await getLatestProfile(player);

      const experience = profile.leveling?.experience ?? 0;
      const level = experience ? experience / 100 : 0;
      this.send(`${username}'s Skyblock Level: ${level}`);
    } catch (error) {
      console.error(error);
      this.send(`[ERROR] ${error}`);
    }
  }
}

export default SkyBlockLevelCommand;
