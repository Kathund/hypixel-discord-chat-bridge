import Command from "../Private/Command.js";
import CommandData from "../Private/CommandData.js";
import CommandDataOption from "../Private/CommandDataOption.js";
import { FormatNumber } from "../../Utils/StringUtils.js";
import { getPlayer } from "../../Utils/HypixelUtils.js";
import type { MinecraftManagerWithBot } from "../../Types/Minecraft.js";

// CREDITS: by @Kathund (https://github.com/Kathund)
class BlitzSurvivalGamesCommand extends Command {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new CommandData()
      .setName("blitzsurvivalgames")
      .setDescription("Blitz Survival Games stats of specified user.")
      .setAliases(["blitz", "blitzsg", "bsg"])
      .setOptions([new CommandDataOption().setName("username").setDescription("Minecraft Username")]);
  }

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const hypixelPlayer = await getPlayer(player);
    const { wins, kills, KDRatio, WLRatio, coins } = hypixelPlayer.stats.BlitzSurvivalGames;
    this.send(
      `${hypixelPlayer.nickname}'s BlitzSG Kills: ${FormatNumber(kills)} KDR: ${KDRatio} | Wins: ${FormatNumber(wins)} WLR: ${WLRatio} | Coins: ${FormatNumber(coins)}`
    );
  }
}

export default BlitzSurvivalGamesCommand;
