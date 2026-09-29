import HypixelDiscordChatBridgeError from "../../private/error.ts";
import MinecraftCommand from "../private/commands/MinecraftCommand.ts";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.ts";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.ts";
import { getGuild } from "../../utils/hypixelUtils.ts";

class GuildExperienceCommand extends MinecraftCommand {
  override readonly data = new MinecraftCommandData()
    .setName("guildexp")
    .setDescription("Guilds experience of specified user.")
    .setAliases(["gexp"])
    .setOptions([new MinecraftCommandDataOption().setName("username").setDescription("Minecraft Username")]);

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const guild = await getGuild("player", player);
    if (guild === null || guild.me === null) throw new HypixelDiscordChatBridgeError("Player is not in a guild");
    const { weeklyExperience } = guild.me;
    await this.send(`${player}'s Weekly Guild Experience: ${weeklyExperience.toLocaleString()}.`);
  }
}

export default GuildExperienceCommand;
