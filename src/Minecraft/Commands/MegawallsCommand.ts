import Command from "../Private/Command.js";
import CommandData from "../Private/CommandData.js";
import CommandDataOption from "../Private/CommandDataOption.js";
import { FormatError } from "../../Utils/MiscUtils.js";
import { getPlayer } from "../../Utils/HypixelUtils.js";
import type { MinecraftManagerWithBot } from "../../Types/Minecraft.js";

class EightBallCommand extends Command {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new CommandData()
      .setName("megawalls")
      .setAliases(["mw"])
      .setOptions([new CommandDataOption().setName("username").setRequired(false)]);
  }

  override async execute(player: string, message: string) {
    try {
      player = this.getArgs(message)[0] || player;
      const hypixelPlayer = await getPlayer(player);
      const { selectedClass, finalKills, FKDR, wins, WLR, kills, KDR, assists } = hypixelPlayer.stats.MegaWalls;
      this.send(
        `${player}'s Megawalls: Class: ${selectedClass} | FK: ${finalKills} | FKDR: ${FKDR} | W: ${wins} | WLR: ${WLR} | K: ${kills} | KDR: ${KDR} | A: ${assists}`
      );
    } catch (error) {
      if (error instanceof Error) this.send(FormatError(error));
    }
  }
}

export default EightBallCommand;
