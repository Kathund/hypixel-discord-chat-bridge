import MinecraftCommand from "../private/commands/MinecraftCommand.ts";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.ts";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.ts";
import { formatNumber } from "../../utils/stringUtils.ts";
import { getSelectedProfile } from "../../utils/hypixelUtils.ts";

class BestiaryCommand extends MinecraftCommand {
  override readonly data = new MinecraftCommandData()
    .setName("bestiary")
    .setDescription("Bestiary of specified user.")
    .setAliases(["be"])
    .setOptions([new MinecraftCommandDataOption().setName("username").setDescription("Minecraft Username")]);

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const { username, profile } = await getSelectedProfile(player);
    const { level, maxLevel, familyTiers, maxFamilyTiers, familiesUnlocked, totalFamilies, familiesCompleted } = profile.me.bestiary;
    const progress = formatNumber((profile.me.bestiary.level / profile.me.bestiary.maxLevel) * 100, 2);
    await this.send(
      `${username}'s Bestiary: ${level} / ${maxLevel} (${progress}%) | Unlocked Tiers: ${familyTiers} / ${maxFamilyTiers} | Unlocked Families: ${familiesUnlocked} / ${
        totalFamilies
      } | Families Maxed: ${familiesCompleted}`
    );
  }
}

export default BestiaryCommand;
