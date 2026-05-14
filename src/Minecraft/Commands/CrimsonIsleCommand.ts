import Command from "../Private/Command.js";
import CommandData from "../Private/CommandData.js";
import CommandDataOption from "../Private/CommandDataOption.js";
import { FormatNumber, TitleCase } from "../../Utils/StringUtils.js";
import { getSelectedProfile } from "../../Utils/HypixelUtils.js";
import type { MinecraftManagerWithBot } from "../../Types/Minecraft.js";

class CrimsonIsleCommand extends Command {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new CommandData()
      .setName("crimsonisle")
      .setAliases(["crimson", "nether", "isle"])
      .setOptions([new CommandDataOption().setName("username").setRequired(false)]);
  }

  override async execute(player: string, message: string) {
    const args = this.getArgs(message);
    player = args[0] || player;

    const { username, profile } = await getSelectedProfile(player);
    const { faction, barbariansReputation, magesReputation } = profile.me.crimsonIsle;
    this.send(
      `${username}'s Faction: ${TitleCase(faction)} | Barbarian Reputation: ${FormatNumber(barbariansReputation)} | Mage Reputation: ${FormatNumber(magesReputation)}`
    );
  }
}

export default CrimsonIsleCommand;
