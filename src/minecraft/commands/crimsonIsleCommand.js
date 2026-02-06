import MinecraftCommand from "../../contracts/MinecraftCommand.js";
import { formatNumber } from "../../contracts/helperFunctions.js";
import { getCrimsonIsle } from "../../../API/stats/crimson.js";
import { getLatestProfile } from "../../../API/functions/getLatestProfile.js";

class CrimsonIsleCommand extends MinecraftCommand {
  /** @param {import("minecraft-protocol").Client} minecraft */
  constructor(minecraft) {
    super(minecraft);

    this.name = "crimsonisle";
    this.aliases = ["crimson", "nether", "isle"];
    this.description = "Crimson Isle Stats of specified user.";
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

      const crimsonData = getCrimsonIsle(profile);
      if (crimsonData === null) {
        throw new Error(`${username} has never gone to Crimson Isle on ${profileData.profileData.cute_name}.`);
      }

      this.send(
        `${username}'s Faction: ${crimsonData.faction} | Barbarian Reputation: ${formatNumber(
          crimsonData.reputation.barbarian
        )} | Mage Reputation: ${formatNumber(crimsonData.reputation.mage)}`
      );
    } catch (error) {
      console.error(error);
      this.send(`[ERROR] ${error}`);
    }
  }
}

export default CrimsonIsleCommand;
