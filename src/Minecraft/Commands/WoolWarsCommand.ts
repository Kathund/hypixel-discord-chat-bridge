import Command from "../Private/Command.js";
import CommandData from "../Private/CommandData.js";
import CommandDataOption from "../Private/CommandDataOption.js";
import { FormatNumber } from "../../Utils/StringUtils.js";
import { getPlayer } from "../../Utils/HypixelUtils.js";
import type { MinecraftManagerWithBot } from "../../Types/Minecraft.js";

class WoolWarsCommand extends Command {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new CommandData()
      .setName("woolwars")
      .setDescription("WoolWars stats of specified user.")
      .setAliases(["ww"])
      .setOptions([new CommandDataOption().setName("username").setDescription("Minecraft Username")]);
  }

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const hypixelPlayer = await getPlayer(player);
    const { level } = hypixelPlayer.stats.WoolGames;
    const { wins, gamesPlayed, woolsPlaced, blocksBroken, KDRatio } = hypixelPlayer.stats.WoolGames.woolWars;
    this.send(
      `[${Math.floor(level)}✫] ${player}: W: ${FormatNumber(wins)} | WLR: ${(wins / gamesPlayed).toFixed(2)} | KDR: ${KDRatio} | BB: ${FormatNumber(
        blocksBroken
      )} | WP: ${FormatNumber(woolsPlaced)} | WPP: ${FormatNumber(woolsPlaced / gamesPlayed)} | WPG: ${(woolsPlaced / blocksBroken).toFixed(2)}`
    );
  }
}

export default WoolWarsCommand;
