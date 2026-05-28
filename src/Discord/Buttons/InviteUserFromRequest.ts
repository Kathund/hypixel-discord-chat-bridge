import Button from '../Private/Buttons/Button.js';
import ButtonData from '../Private/Buttons/ButtonData.js';
import HypixelDiscordChatBridgeError from '../../Private/Error.js';
import { CommandFlags, type DiscordManagerWithBot } from '../../Types/Discord.js';
import { SuccessEmbed } from '../Private/Embed.js';
import type { ButtonInteraction, Message } from 'discord.js';

class InviteUserFromRequestButton extends Button<DiscordManagerWithBot> {
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new ButtonData('inviteUserFromRequest');
    this.flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.StaffOnly];
  }

  override async execute(interaction: ButtonInteraction): Promise<void> {
    const username = this.getUsername(interaction.message);
    if (!username) throw new HypixelDiscordChatBridgeError('Unable to find username');
    this.discord.Application.minecraft.bot.chat(`/g invite ${username}`);
    await interaction.followUp({ embeds: [new SuccessEmbed().setDescription(`Successfully invited \`${username}\` to the guild.`)] });
  }

  getUsername(message: Message): string | undefined {
    const embed = message.embeds[0];
    if (embed === undefined) return undefined;
    const description = embed.description;
    if (description === null) return undefined;
    const split = description.split(' ');
    return split[0];
  }
}

export default InviteUserFromRequestButton;
