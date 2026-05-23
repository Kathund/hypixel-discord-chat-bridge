import Command from '../../Private/Commands/Command.js';
import CommandData from '../../Private/Commands/CommandData.js';
import MowojangAPI from '../../../Private/MowojangAPI.js';
import { CommandFlags, type DiscordManagerWithBot } from '../../../Types/Discord.js';
import { SuccessEmbed } from '../../Private/Embed.js';
import type { ChatInputCommandInteraction } from 'discord.js';
import HypixelDiscordChatBridgeError from '../../../Private/Error.js';

class UpdateCommand extends Command<DiscordManagerWithBot> {
  discordId: string | null;
  isSelf: boolean;
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new CommandData().setName('update').setDescription('Update your current roles');
    this.flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.VerificationCommand];
    this.discordId = null;
    this.isSelf = false;
  }

  override async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    if (this.discordId === null) {
      this.isSelf = true;
      this.discordId = interaction.user.id;
    }

    const linkedUser = this.discord.Application.linked.getUserByDiscordId(this.discordId);
    if (linkedUser === undefined) throw new HypixelDiscordChatBridgeError('User is not verified');

    const response = await linkedUser.updateRoles();
    if (response === null) throw new HypixelDiscordChatBridgeError("Something wen't wrong with updating");

    await interaction.followUp({
      embeds: [
        new SuccessEmbed()
          .setDescription(
            `Successfully synced ${this.isSelf ? 'your' : `<@${this.discordId}>`} roles with \`${await MowojangAPI.getUsername(linkedUser.uuid)}\`'s stats!`
          )
          .setDevFooter('Kathund')
      ]
    });
  }
}

export default UpdateCommand;
