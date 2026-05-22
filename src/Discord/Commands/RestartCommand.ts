import Command from '../Private/Commands/Command.js';
import CommandData from '../Private/Commands/CommandData.js';
import Embed from '../Private/Embed.js';
import { CommandFlags, type DiscordManagerWithClient } from '../../Types/Discord.js';
import type { ChatInputCommandInteraction } from 'discord.js';

class RestartCommand extends Command {
  constructor(discord: DiscordManagerWithClient) {
    super(discord);
    this.data = new CommandData().setName('restart').setDescription('Restarts the bot.');
    this.flags = [CommandFlags.StaffOnly];
  }

  override async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.followUp({ embeds: [new Embed().setTitle('Restarting...').setDescription('The bot is restarting. This might take few seconds.')] });
    this.discord.Application.stop().then(() => this.discord.Application.connect());
    await interaction.followUp({ embeds: [new Embed().setTitle('Success').setDescription('The bot has been restarted successfully.')] });
  }
}

export default RestartCommand;
