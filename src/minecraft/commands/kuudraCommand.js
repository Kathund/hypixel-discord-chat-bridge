import MinecraftCommand from "../../contracts/MinecraftCommand.js";
import { formatNumber } from "../../contracts/helperFunctions.js";
import { getKuudra } from "../../../API/stats/crimson.js";
import { getLatestProfile } from "../../../API/functions/getLatestProfile.js";

class KuudraCommand extends MinecraftCommand {
  /** @param {import("minecraft-protocol").Client} minecraft */
  constructor(minecraft) {
    super(minecraft);

    this.name = "kuudra";
    this.aliases = [];
    this.description = "Kuudra Stats of specified user.";
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

      const kuudraData = getKuudra(profile);
      if (kuudraData === null) {
        throw new Error(`${username} has never gone to Crimson Isle on ${profileData.cute_name}.`);
      }

      this.send(
        `${username}'s Basic: ${formatNumber(kuudraData.basic)} | Hot: ${formatNumber(
          kuudraData.hot
        )} | Burning: ${formatNumber(kuudraData.burning)} | Fiery: ${formatNumber(kuudraData.fiery)} | Infernal: ${formatNumber(kuudraData.infernal)}`
      );
    } catch (error) {
      console.error(error);
      this.send(`[ERROR] ${error}`);
    }
  }
}

export default KuudraCommand;
