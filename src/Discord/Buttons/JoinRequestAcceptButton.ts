import Button from '../Private/Buttons/Button.js';
import ButtonData from '../Private/Buttons/ButtonData.js';
import HypixelDiscordChatBridgeError from '../../Private/Error.js';
import { ActionRowBuilder, ButtonBuilder, type ButtonInteraction, ButtonStyle, type Message } from 'discord.js';
import { CommandFlags, type DiscordManagerWithBot } from '../../Types/Discord.js';
import { SuccessEmbed } from '../Private/Embed.js';

class JoinRequestAcceptButton extends Button<DiscordManagerWithBot> {
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new ButtonData('joinRequestAccept');
    this.flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.StaffOnly];
  }

  override async execute(interaction: ButtonInteraction): Promise<void> {
    const username = this.getUsername(interaction.message);
    if (!username) throw new HypixelDiscordChatBridgeError('Unable to find username');
    this.discord.Application.minecraft.bot.chat(`/g accept ${username}`);
    await interaction.followUp({ embeds: [new SuccessEmbed().setDescription(`Successfully accepted \`${username}\` into the guild.`)] });
    await interaction.message.edit({
      embeds: interaction.message.embeds,
      components: [
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder().setCustomId('joinRequestAccept').setLabel('Accept Request').setStyle(ButtonStyle.Success).setDisabled(true)
        )
      ]
    });
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

export default JoinRequestAcceptButton;
