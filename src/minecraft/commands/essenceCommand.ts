import MinecraftCommand from "../private/commands/MinecraftCommand.ts";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.ts";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.ts";
import { formatNumber, titleCase } from "../../utils/stringUtils.ts";
import { getSelectedProfile } from "../../utils/hypixelUtils.ts";

class EssenceCommand extends MinecraftCommand {
  override readonly data = new MinecraftCommandData()
    .setName("essence")
    .setDescription("Skyblock Dungeons Stats of specified user.")
    .setOptions([new MinecraftCommandDataOption().setName("username").setDescription("Minecraft Username")])
    .setAuthors(["Amber"]);

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const { username, profile } = await getSelectedProfile(player);
    const formattedEssence = Object.entries(profile.me.currencies)
      .filter(([key]) => key.endsWith("Essence"))
      .map(([name, stat]) => ({ name: name.replaceAll("Essence", ""), stat }))
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(({ name, stat }) => `${titleCase(name)}: ${formatNumber(stat)}`);

    await this.send(`${username}'s Essence: ${formattedEssence.join(", ")}`);
  }
}

export default EssenceCommand;
