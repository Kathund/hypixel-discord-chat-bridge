import HypixelDiscordChatBridgeError from "../../private/error.ts";
import MinecraftCommand from "../private/commands/MinecraftCommand.ts";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.ts";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.ts";
import { formatNumber } from "../../utils/stringUtils.ts";
import { getGuild } from "../../utils/hypixelUtils.ts";

class GuildOfCommand extends MinecraftCommand {
  override readonly data = new MinecraftCommandData()
    .setName("guildof")
    .setDescription("View the player's guild")
    .setAliases(["gof", "guildofplayer", "gop"])
    .setOptions([new MinecraftCommandDataOption().setName("player").setRequired(true)])
    .setAuthors(["MattyHD0"]);

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const guild = await getGuild("player", player);
    if (guild === null) throw new HypixelDiscordChatBridgeError("Player is not in a guild");
    const { name, tag, members, level, totalWeeklyGEXP } = guild;
    await this.send(`Guild of ${player} is ${name} | Tag: [${tag}] | Members: ${members.length} | Level: ${level} | Weekly GEXP: ${formatNumber(totalWeeklyGEXP)}`);
  }
}

export default GuildOfCommand;
