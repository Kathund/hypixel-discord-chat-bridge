import MinecraftCommand from "../private/commands/MinecraftCommand.ts";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.ts";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.ts";
import { formatNumber, titleCase } from "../../utils/stringUtils.ts";
import { getSelectedProfile } from "../../utils/hypixelUtils.ts";

class KuudraCommand extends MinecraftCommand {
  override readonly data = new MinecraftCommandData()
    .setName("kuudra")
    .setDescription("Kuudra Stats of specified user.")
    .setOptions([new MinecraftCommandDataOption().setName("username").setDescription("Minecraft Username")])
    .setAuthors(["Amber"]);

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const { username, profile } = await getSelectedProfile(player);
    const formattedKuudra = Object.entries(profile.me.crimsonIsle.kuudra)
      .filter(([key]) => key.endsWith("Completions"))
      .map(([name, stat]) => ({ name: name.replaceAll("Completions", ""), stat }))
      .map(({ name, stat }) => `${titleCase(name)}: ${formatNumber(stat)}`);
    await this.send(`${username}'s ${formattedKuudra.join(" | ")}`);
  }
}

export default KuudraCommand;
