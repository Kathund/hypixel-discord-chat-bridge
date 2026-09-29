import MinecraftCommand from "../private/commands/MinecraftCommand.ts";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.ts";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.ts";
import { formatNumber } from "../../utils/stringUtils.ts";
import { getPlayer } from "../../utils/hypixelUtils.ts";

class WoolWarsCommand extends MinecraftCommand {
  override readonly data = new MinecraftCommandData()
    .setName("woolwars")
    .setDescription("WoolWars stats of specified user.")
    .setAliases(["ww"])
    .setOptions([new MinecraftCommandDataOption().setName("username").setDescription("Minecraft Username")]);

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const hypixelPlayer = await getPlayer(player);
    const { progression, woolWars } = hypixelPlayer.stats.WoolGames;
    const { wins, winLossRatio, killDeathRatio, blocksBroken, woolPlaced, gamesPlayed } = woolWars;
    await this.send(
      `[${progression.level}✫] ${hypixelPlayer.nickname}'s Wins: ${formatNumber(wins)} | WLR: ${winLossRatio} | KDR: ${killDeathRatio} | BB: ${formatNumber(
        blocksBroken
      )} | WP: ${formatNumber(woolPlaced)} | WPG: ${formatNumber(woolPlaced / gamesPlayed)}`
    );
  }
}

export default WoolWarsCommand;
