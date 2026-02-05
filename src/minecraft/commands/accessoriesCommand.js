import { getLatestProfile } from "../../../API/functions/getLatestProfile.js";
import MinecraftCommand from "../../contracts/MinecraftCommand.js";
import { getAccessories } from "../../../API/stats/accessories.js";
import { formatNumber } from "../../contracts/helperFunctions.js";

class AccessoriesCommand extends MinecraftCommand {
  /** @param {import("minecraft-protocol").Client} minecraft */
  constructor(minecraft) {
    super(minecraft);

    this.name = "accessories";
    this.aliases = ["acc", "talismans", "talisman", "mp", "magicpower"];
    this.description = "Accessories of specified user.";
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
      player = args[0] ?? player;

      const { profile, username } = await getLatestProfile(player);

      if (profile.inventory?.bag_contents?.talisman_bag?.data == undefined && profile.inventory?.inv_contents?.data == null) {
        throw `${username} has Talisman API off.`;
      }

      const talismans = await getAccessories(profile);
      if (!talismans) {
        throw `Couldn't parse ${username}'s talismans.`;
      }

      const formattedRarities = Object.entries(talismans.rarities)
        .filter(([, amount]) => amount > 0)
        .map(([rarity, amount]) => `${amount}${(rarity?.at(0) ?? "").toUpperCase()}`)
        .join(", ");

      this.send(
        `${username}'s Accessories: ${talismans.amount} (${formatNumber(talismans.magicalPower)} MP), Recombed: ${talismans.recombed}, Enriched: ${talismans.enriched} (${formattedRarities})`
      );
    } catch (error) {
      this.send(`[ERROR] ${error}`);
    }
  }
}

export default AccessoriesCommand;
