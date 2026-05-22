import Command from '../Private/Command.js';
import CommandData from '../Private/CommandData.js';
import CommandDataOption from '../Private/CommandDataOption.js';
import HypixelDiscordChatBridgeError from '../../Private/Error.js';
import { FormatNumber, TitleCase } from '../../Utils/StringUtils.js';
import { getSelectedProfile } from '../../Utils/HypixelUtils.js';
import type { MinecraftManagerWithBot } from '../../Types/Minecraft.js';
import type { SkyBlockMemberSlayer } from 'hypixel-api-reborn';

class SkyblockCommand extends Command {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new CommandData()
      .setName('skyblock')
      .setDescription('Skyblock Stats of specified user.')
      .setAliases(['stats', 'sb'])
      .setOptions([new CommandDataOption().setName('username').setDescription('Minecraft Username')]);
  }

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const { username, profile } = await getSelectedProfile(player);
    const { dungeons, slayers, playerData, leveling, inventory, skillTrees } = profile.me;
    const decodedTalismans = await inventory.bags.talisman.decodeData();
    if (!decodedTalismans) throw new HypixelDiscordChatBridgeError(`${username} has no SkyBlock profiles.`);

    const slayer = Object.keys(slayers)
      .filter((slayer) => slayer !== 'activeSlayer')
      .map((slayer) => {
        const slayerData: SkyBlockMemberSlayer = slayers[slayer as keyof typeof slayers] as SkyBlockMemberSlayer;
        return `${FormatNumber(slayerData.level.level, 0)}${TitleCase(slayer)[0]}`;
      })
      .join(', ');

    this.send(
      `${username}'s Level: ${leveling.level} | Skill Avg: ${FormatNumber(playerData.skills.average, 2)} | Slayer: ${slayer} | Cata: ${FormatNumber(
        dungeons.level.level,
        2
      )} | Class Avg: ${FormatNumber(dungeons.classes.average, 2)} | MP: ${FormatNumber(decodedTalismans.magicalPower, 2)} | Hotm: ${FormatNumber(
        skillTrees.mining.level.level,
        2
      )}`
    );
  }
}

export default SkyblockCommand;
