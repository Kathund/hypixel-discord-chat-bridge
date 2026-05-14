import Command from "../Private/Command.js";
import CommandData from "../Private/CommandData.js";
import CommandDataOption from "../Private/CommandDataOption.js";
import { getPlayer } from "../../Utils/HypixelUtils.js";
import type { MinecraftManagerWithBot } from "../../Types/Minecraft.js";

class SkyWarsCommand extends Command {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new CommandData()
      .setName("skywars")
      .setAliases(["sw"])
      .setOptions([new CommandDataOption().setName("username").setRequired(false)]);
  }

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const hypixelPlayer = await getPlayer(player);
    const { wins, kills, level, WLRatio, coins } = hypixelPlayer.stats.SkyWars;
    this.send(`[${level}✫] ${hypixelPlayer.nickname} | Kills: ${kills.total.kills} KDR: ${kills.total.ratio} | Wins: ${wins} WLR: ${WLRatio} | Coins: ${coins}`);
  }
}

export default SkyWarsCommand;
