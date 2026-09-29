import MinecraftCommand from "../private/commands/MinecraftCommand.ts";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.ts";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.ts";
import { getPlayer } from "../../utils/hypixelUtils.ts";

class SkyWarsCommand extends MinecraftCommand {
  override readonly data = new MinecraftCommandData()
    .setName("skywars")
    .setDescription("Skywars stats of specified user.")
    .setAliases(["sw"])
    .setOptions([new MinecraftCommandDataOption().setName("username").setDescription("Minecraft Username")]);

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const hypixelPlayer = await getPlayer(player);
    const { wins, kills, level, winLossRatio, coins } = hypixelPlayer.stats.SkyWars;
    await this.send(
      `[${level}✫] ${hypixelPlayer.nickname} | Kills: ${kills.total.kills} KDR: ${kills.total.ratio} | Wins: ${wins} WLR: ${winLossRatio} | Coins: ${coins}`
    );
  }
}

export default SkyWarsCommand;
