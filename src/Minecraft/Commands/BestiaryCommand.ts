import Command from "../Private/Command.js";
import CommandData from "../Private/CommandData.js";
import CommandDataOption from "../Private/CommandDataOption.js";
import { FormatNumber } from "../../Utils/StringUtils.js";
import { getSelectedProfile } from "../../Utils/HypixelUtils.js";
import type { MinecraftManagerWithBot } from "../../Types/Minecraft.js";

class BestiaryCommand extends Command {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new CommandData()
      .setName("bestiary")
      .setAliases(["be"])
      .setOptions([new CommandDataOption().setName("username").setRequired(false)]);
  }

  override async execute(player: string, message: string) {
    try {
      const args = this.getArgs(message);
      player = args[0] ?? player;

      const { username, profile } = await getSelectedProfile(player);
      const { level, maxLevel, familyTiers, maxFamilyTiers, familiesUnlocked, totalFamilies, familiesCompleted } = profile.me.bestiary;

      const progress = FormatNumber((profile.me.bestiary.level / profile.me.bestiary.maxLevel) * 100, 2);
      this.send(
        `${username}'s Bestiary: ${level} / ${maxLevel} (${progress}%) | Unlocked Tiers: ${familyTiers} / ${maxFamilyTiers} | Unlocked Families: ${familiesUnlocked} / ${
          totalFamilies
        } | Families Maxed: ${familiesCompleted}`
      );
    } catch (error) {
      console.error(error);
      this.send(`[ERROR] ${error}`);
    }
  }
}

export default BestiaryCommand;
