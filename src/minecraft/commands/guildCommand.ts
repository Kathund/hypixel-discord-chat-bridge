import HypixelDiscordChatBridgeError from "../../private/error.ts";
import MinecraftCommand from "../private/commands/MinecraftCommand.ts";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.ts";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.ts";
import { formatNumber } from "../../utils/stringUtils.ts";
import { getGuild } from "../../utils/hypixelUtils.ts";

class GuildCommand extends MinecraftCommand {
  override readonly data = new MinecraftCommandData()
    .setName("guild")
    .setDescription("View information of a guild")
    .setAliases(["g"])
    .setOptions([new MinecraftCommandDataOption().setName("guild").setRequired(true)]);

  override async execute(player: string, message: string) {
    const guild = await getGuild("name", this.getArgs(message).join(" "));
    if (guild === null) throw new HypixelDiscordChatBridgeError("Guild does not exist");
    const { name, tag, members, level, totalWeeklyGEXP } = guild;
    await this.send(`Guild ${name} | Tag: [${tag}] | Members: ${members.length} | Level: ${level} | Weekly GEXP: ${formatNumber(totalWeeklyGEXP)}`);
  }
}

export default GuildCommand;
