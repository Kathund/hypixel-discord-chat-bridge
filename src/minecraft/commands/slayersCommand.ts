import MinecraftCommand from "../private/commands/MinecraftCommand.ts";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.ts";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.ts";
import { SkyBlockMemberSlayer } from "hypixel-api-reborn";
import { formatNumber, titleCase } from "../../utils/stringUtils.ts";
import { getSelectedProfile } from "../../utils/hypixelUtils.ts";

class SlayersCommand extends MinecraftCommand {
  override readonly data = new MinecraftCommandData()
    .setName("slayer")
    .setDescription("Slayer of specified user.")
    .setAliases(["slayers"])
    .setOptions([new MinecraftCommandDataOption().setName("username").setDescription("Minecraft Username")]);

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const { username, profile } = await getSelectedProfile(player);
    const formattedSlayers = Object.entries(profile.me.slayers)
      .filter(([_, data]) => data instanceof SkyBlockMemberSlayer)
      .map(([name, data]) => ({ name, stat: data.level.level, xp: data.level.xp }))
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(({ name, stat, xp }) => `${titleCase(name)}: ${stat} (${formatNumber(xp)})`);

    await this.send(`${username}'s Slayer: ${formattedSlayers.join(" | ")}`);
  }
}

export default SlayersCommand;
