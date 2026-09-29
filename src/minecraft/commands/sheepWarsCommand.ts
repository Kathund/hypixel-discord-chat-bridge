import MinecraftCommand from "../private/commands/MinecraftCommand.ts";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.ts";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.ts";
import { formatNumber, toCamelCase } from "../../utils/stringUtils.ts";
import { getPlayer } from "../../utils/hypixelUtils.ts";

class SheepWarsCommand extends MinecraftCommand {
  override readonly data = new MinecraftCommandData()
    .setName("sheepwars")
    .setAliases(["sheep", "shep"])
    .setOptions([new MinecraftCommandDataOption().setName("username")]);

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const hypixelPlayer = await getPlayer(player);
    const { progression, sheepWars } = hypixelPlayer.stats.WoolGames;
    const { kit, wins, winLossRatio, kills, killDeathRatio } = sheepWars;
    await this.send(
      `[${progression.level}✫] ${hypixelPlayer.nickname}'s class: ${toCamelCase(kit)} | Wins: ${formatNumber(wins)} | WLR: ${winLossRatio} | Kills: ${formatNumber(
        kills
      )} | KDR: ${killDeathRatio}`
    );
  }
}

export default SheepWarsCommand;
