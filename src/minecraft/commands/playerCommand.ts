import MinecraftCommand from "../private/commands/MinecraftCommand.ts";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.ts";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.ts";
import { formatNumber } from "../../utils/stringUtils.ts";
import { getPlayer } from "../../utils/hypixelUtils.ts";

class PlayerCommand extends MinecraftCommand {
  override readonly data = new MinecraftCommandData()
    .setName("player")
    .setDescription("Get Hypixel Player Stats")
    .setOptions([new MinecraftCommandDataOption().setName("username").setDescription("Minecraft Username")]);

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const hypixelPlayer = await getPlayer(player, { guild: true });
    const { formattedNickname, karma, level, guild, achievements } = hypixelPlayer;
    const guildName = guild ? guild.name : "None";
    await this.send(
      `${formattedNickname}'s level: ${level.level} | Karma: ${formatNumber(karma, 0)} | Achievement Points: ${formatNumber(achievements.points, 0)} Guild: ${guildName}`
    );
  }
}

export default PlayerCommand;
