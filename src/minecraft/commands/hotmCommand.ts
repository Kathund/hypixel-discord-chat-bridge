import MinecraftCommand from "../private/commands/MinecraftCommand.ts";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.ts";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.ts";
import { SkyBlockMemberMiningPowder } from "hypixel-api-reborn";
import { formatNumber, titleCase } from "../../utils/stringUtils.ts";
import { getSelectedProfile } from "../../utils/hypixelUtils.ts";

class HotmCommand extends MinecraftCommand {
  override readonly data = new MinecraftCommandData()
    .setName("hotm")
    .setDescription("Skyblock Hotm Stats of specified user.")
    .setAliases(["mining"])
    .setOptions([new MinecraftCommandDataOption().setName("username").setDescription("Minecraft Username")])
    .setAuthors(["Amber"]);

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const { username, profile } = await getSelectedProfile(player);
    const { level } = profile.me.skillTrees.mining;
    const { powder, pickaxeAbility } = profile.me.mining;
    const formattedPowder = Object.entries(powder)
      .filter(([name, data]) => data instanceof SkyBlockMemberMiningPowder)
      .map(([name, data]) => ({ name, stat: data.total }))
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(({ name, stat }) => `${titleCase(name)} Powder: ${formatNumber(stat)}`);
    await this.send(`${username}'s Hotm: ${level.level} | Selected Ability: ${pickaxeAbility} | ${formattedPowder.join(" | ")}`);
  }
}

export default HotmCommand;
