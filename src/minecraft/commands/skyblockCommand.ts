import HypixelDiscordChatBridgeError from "../../private/error.ts";
import MinecraftCommand from "../private/commands/MinecraftCommand.ts";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.ts";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.ts";
import { formatNumber, titleCase } from "../../utils/stringUtils.ts";
import { getSelectedProfile } from "../../utils/hypixelUtils.ts";
import type { SkyBlockMemberSlayer } from "hypixel-api-reborn";

class SkyblockCommand extends MinecraftCommand {
  override readonly data = new MinecraftCommandData()
    .setName("skyblock")
    .setDescription("Skyblock Stats of specified user.")
    .setAliases(["stats", "sb"])
    .setOptions([new MinecraftCommandDataOption().setName("username").setDescription("Minecraft Username")]);

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const { username, profile } = await getSelectedProfile(player);
    const { dungeons, slayers, playerData, leveling, inventory, skillTrees } = profile.me;
    const decodedTalismans = await inventory.bags.talisman.decodeData();
    if (!decodedTalismans) throw new HypixelDiscordChatBridgeError(`${username} has no SkyBlock profiles.`);

    const slayer = Object.keys(slayers)
      .filter((slayer) => slayer !== "activeSlayer")
      .map((slayer) => {
        const slayerData: SkyBlockMemberSlayer = slayers[slayer as keyof typeof slayers] as SkyBlockMemberSlayer;
        return `${formatNumber(slayerData.level.level, 0)}${titleCase(slayer)[0]}`;
      })
      .join(", ");

    await this.send(
      `${username}'s Level: ${leveling.level} | Skill Avg: ${formatNumber(playerData.skills.average, 2)} | Slayer: ${slayer} | Cata: ${formatNumber(
        dungeons.level.level,
        2
      )} | Class Avg: ${formatNumber(dungeons.classes.average, 2)} | MP: ${formatNumber(decodedTalismans.magicalPower, 2)} | Hotm: ${formatNumber(
        skillTrees.mining.level.level,
        2
      )}`
    );
  }
}

export default SkyblockCommand;
