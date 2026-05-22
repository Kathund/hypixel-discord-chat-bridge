import Command from "../Private/Command.js";
import CommandData from "../Private/CommandData.js";
import CommandDataOption from "../Private/CommandDataOption.js";
import { FormatError } from "../../Utils/MiscUtils.js";
import { FormatNumber } from "../../Utils/StringUtils.js";
import { getPlayer } from "../../Utils/HypixelUtils.js";
import type { MinecraftManagerWithBot } from "../../Types/Minecraft.js";

class PlayerCommand extends Command {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new CommandData()
      .setName("player")
      .setDescription("Get Hypixel Player Stats")
      .setOptions([new CommandDataOption().setName("username").setDescription("Minecraft Username")]);
  }

  override async execute(player: string, message: string) {
    try {
      player = this.getArgs(message)[0] || player;
      const hypixelPlayer = await getPlayer(player, { guild: true });
      const { formattedNickname, karma, level, guild, achievements } = hypixelPlayer;
      const guildName = guild ? guild.name : "None";
      this.send(
        `${formattedNickname}'s level: ${level} | Karma: ${FormatNumber(karma, 0)} | Achievement Points: ${FormatNumber(achievements.points, 0)} Guild: ${guildName}`
      );
    } catch (error) {
      if (error instanceof Error) this.send(FormatError(error));
    }
  }
}

export default PlayerCommand;
