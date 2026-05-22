import Command from '../Private/Command.js';
import CommandData from '../Private/CommandData.js';
import CommandDataOption from '../Private/CommandDataOption.js';
import HypixelAPIReborn from '../../Private/HypixelAPIReborn.js';
import HypixelDiscordChatBridgeError from '../../Private/Error.js';
import type { MinecraftManagerWithBot } from '../../Types/Minecraft.js';

class GuildExperienceCommand extends Command {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new CommandData()
      .setName('guildexp')
      .setDescription('Guilds experience of specified user.')
      .setAliases(['gexp'])
      .setOptions([new CommandDataOption().setName('username').setDescription('Minecraft Username')]);
  }

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const guild = await HypixelAPIReborn.getGuild('player', player).then((data) => {
      if (data === null) throw new HypixelDiscordChatBridgeError('Player is not in a guild');
      if (data.isRaw()) throw new HypixelDiscordChatBridgeError("Failed to fetch Player's guild data.");
      return data;
    });
    if (guild.me === null) throw new HypixelDiscordChatBridgeError('Player is not in a guild');
    const { weeklyExperience } = guild.me;
    this.send(`${player}'s Weekly Guild Experience: ${weeklyExperience.toLocaleString()}.`);
  }
}

export default GuildExperienceCommand;
