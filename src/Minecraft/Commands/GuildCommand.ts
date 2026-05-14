import Command from "../Private/Command.js";
import CommandData from "../Private/CommandData.js";
import CommandDataOption from "../Private/CommandDataOption.js";
import HypixelAPIReborn from "../../Private/HypixelAPIReborn.js";
import HypixelDiscordChatBridgeError from "../../Private/Error.js";
import { FormatNumber } from "../../Utils/StringUtils.js";
import type { MinecraftManagerWithBot } from "../../Types/Minecraft.js";

class GuildCommand extends Command {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new CommandData()
      .setName("guild")
      .setAliases(["g"])
      .setOptions([new CommandDataOption().setName("guild").setRequired(true)]);
  }

  override async execute(player: string, message: string) {
    const guild = await HypixelAPIReborn.getGuild("name", this.getArgs(message).join(" ")).then((data) => {
      if (data === null) throw new HypixelDiscordChatBridgeError("Player is not in a guild");
      if (data.isRaw()) throw new HypixelDiscordChatBridgeError("Failed to fetch Player's guild data.");
      return data;
    });
    const { name, tag, members, level, totalWeeklyGEXP } = guild;
    this.send(`Guild of ${player} is ${name} | Tag: [${tag}] | Members: ${members.length} | Level: ${level} | Weekly GEXP: ${FormatNumber(totalWeeklyGEXP)}`);
  }
}

export default GuildCommand;
