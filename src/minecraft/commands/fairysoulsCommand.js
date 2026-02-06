import MinecraftCommand from "../../contracts/MinecraftCommand.js";
import { getLatestProfile } from "../../../API/functions/getLatestProfile.js";

class FairySoulsCommand extends MinecraftCommand {
  /** @param {import("minecraft-protocol").Client} minecraft */
  constructor(minecraft) {
    super(minecraft);

    this.name = "fairysouls";
    this.aliases = ["fs"];
    this.description = "Fairy Souls of specified user.";
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

      const total = profileData.game_mode === "island" ? 5 : 253;
      const fairySoul = profile.fairy_soul;
      this.send(`${username}'s Fairy Souls: ${fairySoul.total_collected} / ${total} | Progress: ${((fairySoul.total_collected / total) * 100).toFixed(2)}%`);
    } catch (error) {
      this.send(`[ERROR] ${error}`);
    }
  }
}

export default FairySoulsCommand;
