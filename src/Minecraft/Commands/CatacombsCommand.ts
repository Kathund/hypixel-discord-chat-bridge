import Command from "../Private/Command.js";
import CommandData from "../Private/CommandData.js";
import CommandDataOption from "../Private/CommandDataOption.js";
import { FormatNumber } from "../../Utils/StringUtils.js";
import { getSelectedProfile } from "../../Utils/HypixelUtils.js";
import type { MinecraftManagerWithBot } from "../../Types/Minecraft.js";

class CatacombsCommand extends Command {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new CommandData()
      .setName("catacombs")
      .setDescription("Skyblock Dungeons Stats of specified user.")
      .setAliases(["cata", "dungeons"])
      .setOptions([new CommandDataOption().setName("username").setDescription("Minecraft Username")]);
  }

  override async execute(player: string, message: string) {
    const args = this.getArgs(message);
    player = args[0] || player;

    const { username, profile } = await getSelectedProfile(player);

    const { level } = profile.me.dungeons;
    const tank = FormatNumber(profile.me.dungeons.classes.tank.level);
    const archer = FormatNumber(profile.me.dungeons.classes.archer.level);
    const healer = FormatNumber(profile.me.dungeons.classes.healer.level);
    const mage = FormatNumber(profile.me.dungeons.classes.mage.level);
    const berserk = FormatNumber(profile.me.dungeons.classes.berserk.level);

    this.send(
      `${username}'s Catacombs: ${FormatNumber(level.level)} | Selected Class: ${profile.me.dungeons.classes.selected} | Class Average: ${FormatNumber(
        profile.me.dungeons.classes.average
      )} | Secrets Found: ${FormatNumber(profile.me.dungeons.secrets)} | Classes: ${healer}H, ${mage}M, ${berserk}B, ${archer}A, ${mage}M ${tank}T`
    );
  }
}

export default CatacombsCommand;
