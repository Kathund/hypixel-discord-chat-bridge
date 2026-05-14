import Command from "../Private/Command.js";
import CommandData from "../Private/CommandData.js";
import CommandDataOption from "../Private/CommandDataOption.js";
import { FormatNumber } from "../../Utils/StringUtils.js";
import { getPlayer } from "../../Utils/HypixelUtils.js";
import type { MinecraftManagerWithBot } from "../../Types/Minecraft.js";

class DuelsCommand extends Command {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new CommandData()
      .setName("duels")
      .setAliases(["d"])
      .setOptions([new CommandDataOption().setName("username").setRequired(false)]);
  }

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const hypixelPlayer = await getPlayer(player);
    const { wins, kills, KDR, WLR } = hypixelPlayer.stats.Duels;
    this.send(`${hypixelPlayer.nickname}'s Duels Kills: ${FormatNumber(kills)} KDR: ${KDR} | Wins: ${FormatNumber(wins)} WLR: ${WLR}`);
  }
}

export default DuelsCommand;
