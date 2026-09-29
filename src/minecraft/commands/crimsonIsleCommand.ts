import MinecraftCommand from "../private/commands/MinecraftCommand.ts";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.ts";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.ts";
import { formatNumber, titleCase } from "../../utils/stringUtils.ts";
import { getSelectedProfile } from "../../utils/hypixelUtils.ts";

class CrimsonIsleCommand extends MinecraftCommand {
  override readonly data = new MinecraftCommandData()
    .setName("crimsonisle")
    .setDescription("Crimson Isle Stats of specified user.")
    .setAliases(["crimson", "nether", "isle"])
    .setOptions([new MinecraftCommandDataOption().setName("username").setDescription("Minecraft Username")])
    .setAuthors(["Amber"]);

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const { username, profile } = await getSelectedProfile(player);
    const { faction, barbariansReputation, magesReputation } = profile.me.crimsonIsle;
    await this.send(
      `${username}'s Faction: ${titleCase(faction)} | Barbarian Reputation: ${formatNumber(barbariansReputation)} | Mage Reputation: ${formatNumber(magesReputation)}`
    );
  }
}

export default CrimsonIsleCommand;
