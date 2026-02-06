import MinecraftCommand from "../../contracts/MinecraftCommand.js";
import { formatNumber } from "../../contracts/helperFunctions.js";
import { getHotm } from "../../../API/stats/hotm.js";
import { getLatestProfile } from "../../../API/functions/getLatestProfile.js";

class HotmCommand extends MinecraftCommand {
  /** @param {import("minecraft-protocol").Client} minecraft */
  constructor(minecraft) {
    super(minecraft);

    this.name = "hotm";
    this.aliases = ["mining"];
    this.description = "Skyblock Hotm Stats of specified user.";
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

      const hotm = getHotm(profile);
      if (hotm === null) {
        throw new Error(`${username} has never gone to Dwarven Mines on ${profileData.cute_name}.`);
      }

      this.send(
        `${username}'s Hotm: ${formatNumber(hotm.level.levelWithProgress, 2)} | Gemstone Powder: ${formatNumber(
          hotm.powder.gemstone.total
        )} | Mithril Powder: ${formatNumber(hotm.powder.mithril.total)} | Glacite Powder: ${formatNumber(hotm.powder.glacite.total)} | Selected Ability: ${hotm.ability}`
      );
    } catch (error) {
      this.send(`[ERROR] ${error}`);
    }
  }
}

export default HotmCommand;
