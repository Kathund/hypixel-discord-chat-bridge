import MinecraftCommand from "../private/commands/MinecraftCommand.ts";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.ts";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.ts";
import { formatNumber } from "../../utils/stringUtils.ts";
import { getPlayer } from "../../utils/hypixelUtils.ts";

class BuildBattleCommand extends MinecraftCommand {
  override readonly data = new MinecraftCommandData()
    .setName("buildbattle")
    .setDescription("Build Battle Stats of specified user.")
    .setAliases(["bb"])
    .setOptions([new MinecraftCommandDataOption().setName("username").setDescription("Minecraft Username")])
    .setAuthors(["Amber"]);

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const hypixelPlayer = await getPlayer(player);
    const { title, tokens, score, wins, winsSpeedBuilders, winsGuessTheBuild } = hypixelPlayer.stats.BuildBattle;
    await this.send(
      `${title} ${hypixelPlayer.nickname}'s Build Battle Wins: ${formatNumber(wins)} Speed Builders Wins: ${formatNumber(
        winsSpeedBuilders
      )} GTB Wins: ${formatNumber(winsGuessTheBuild)} | Score: ${formatNumber(score)} | Tokens: ${formatNumber(tokens)}`
    );
  }
}

export default BuildBattleCommand;
