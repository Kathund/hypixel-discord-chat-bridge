import Command from "../Private/Command.js";
import CommandData from "../Private/CommandData.js";
import CommandDataOption from "../Private/CommandDataOption.js";
import { FormatNumber } from "../../Utils/StringUtils.js";
import { getPlayer } from "../../Utils/HypixelUtils.js";
import type { MinecraftManagerWithBot } from "../../Types/Minecraft.js";

// CREDITS: by @Kathund (https://github.com/Kathund)
class MurderMysteryCommand extends Command {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new CommandData()
      .setName("murdermystery")
      .setDescription("Get Murder Mystery Player Stats")
      .setAliases(["mm"])
      .setOptions([new CommandDataOption().setName("username").setDescription("Minecraft Username")]);
  }

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const hypixelPlayer = await getPlayer(player);
    const { wins, games, kills, deaths } = hypixelPlayer.stats.MurderMystery;
    const wlr = (wins / games).toFixed(2);
    const kdr = (kills / deaths).toFixed(2);
    this.send(`${hypixelPlayer.nickname}'s Murder Mystery Wins: ${FormatNumber(wins)} | WLR: ${wlr} | Kills: ${FormatNumber(kills)} | KDR: ${kdr}`);
  }
}

export default MurderMysteryCommand;
