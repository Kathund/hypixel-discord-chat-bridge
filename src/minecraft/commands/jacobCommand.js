import { formatNumber, delay, titleCase } from "../../contracts/helperFunctions.js";
import { getLatestProfile } from "../../../API/functions/getLatestProfile.js";
import MinecraftCommand from "../../contracts/MinecraftCommand.js";
import { getJacob } from "../../../API/stats/jacob.js";

class JacobCommand extends MinecraftCommand {
  /** @param {import("minecraft-protocol").Client} minecraft */
  constructor(minecraft) {
    super(minecraft);

    this.name = "jacob";
    this.aliases = ["jacobs", "jacobcontest", "contest"];
    this.description = "Jacob's Contest Stats of specified user.";
    this.options = [];
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

      const { username, profile } = await getLatestProfile(player);

      const jacobData = getJacob(profile);
      if (!jacobData) {
        return this.send(`[ERROR] ${username} does not have Jacob's Contest stats.`);
      }

      this.send(
        `${username}'s Gold Medals: ${jacobData.medals.gold} | Silver: ${jacobData.medals.silver} | Bronze: ${jacobData.medals.bronze} | Double Drops ${jacobData.perks.doubleDrops} / 15 | Level Cap: ${jacobData.perks.levelCap} / 10`
      );

      await delay(1000);

      const personalBests = Object.entries(jacobData.personalBests).map(([key, value]) => `${titleCase(key)}: ${formatNumber(value)}`);
      this.send(`${username}'s Personal Bests: ${personalBests.join(" | ")}`);
    } catch (error) {
      this.send(`[ERROR] ${error}`);
    }
  }
}

export default JacobCommand;
