import MinecraftCommand from "../../contracts/MinecraftCommand.js";
import { formatNumber, titleCase } from "../../contracts/helperFunctions.js";
import { getLatestProfile } from "../../../API/functions/getLatestProfile.js";
import { getSlayer } from "../../../API/stats/slayer.js";

class SlayersCommand extends MinecraftCommand {
  /** @param {import("minecraft-protocol").Client} minecraft */
  constructor(minecraft) {
    super(minecraft);

    this.name = "slayer";
    this.aliases = ["slayers"];
    this.description = "Slayer of specified user.";
    this.options = [
      {
        name: "username",
        description: "Minecraft username",
        required: false
      },
      {
        name: "slayer",
        description: "Slayer type",
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
      const slayer = ["zombie", "spider", "wolf", "enderman", "blaze", "vampire"];

      const slayerType = slayer.includes(args[1]) ? args[1] : null;
      player = args[0] || player;

      const { username, profile } = await getLatestProfile(player);

      const slayerData = getSlayer(profile);
      if (slayerData === null) {
        return this.send(`${username} has no slayer data.`);
      }

      if (slayerType) {
        this.send(`${username}'s ${titleCase(slayerType)} - ${slayerData[slayerType].level} Levels | Experience: ${formatNumber(slayerData[slayerType].xp)}`);
      } else {
        const slayer = Object.keys(slayerData).reduce(
          (acc, slayer) => `${acc} | ${titleCase(slayer)}: ${slayerData[slayer].level} (${formatNumber(slayerData[slayer].xp)})`,
          ""
        );
        this.send(`${username}'s Slayer: ${slayer.slice(3)}`);
      }
    } catch (error) {
      console.log(error);
      this.send(`[ERROR] ${error}`);
    }
  }
}

export default SlayersCommand;
