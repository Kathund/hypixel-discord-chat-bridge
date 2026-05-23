import Command from '../../Private/Commands/Command.js';
import CommandData from '../../Private/Commands/CommandData.js';
import HypixelDiscordChatBridgeError from '../../../Private/Error.js';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, type ChatInputCommandInteraction } from 'discord.js';
import { CommandFlags, CommandResponse, type DiscordManagerWithClient } from '../../../Types/Discord.js';
import { SuccessEmbed } from '../../Private/Embed.js';

class LinkedCommand extends Command {
  constructor(discord: DiscordManagerWithClient) {
    super(discord);
    this.data = new CommandData()
      .setName('linked')
      .setDescription('View who a user is linked to')
      .addUserOption((option) => option.setName('user').setDescription('Discord Username'))
      .addStringOption((option) => option.setName('username').setDescription('Minecraft Username'));
    this.flags = [CommandFlags.StaffOnly, CommandFlags.VerificationCommand];
    this.response = CommandResponse.Ephemeral;
  }

  override async execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser('user');
    const username = interaction.options.getString('username');
    if (!user && !username) throw new HypixelDiscordChatBridgeError('You must specify a user or username.');
    if (user && username) throw new HypixelDiscordChatBridgeError('You cannot specify both user and username.');
    const linkedUser = username ? await this.discord.Application.linked.getUserByUsername(username) : this.discord.Application.linked.getUserByDiscordId(user!.id);
    if (!linkedUser) throw new HypixelDiscordChatBridgeError('User is not verified');
    const [{ uuid, nickname, formattedNickname }, guildMember] = await Promise.all([linkedUser.getHypixelPlayer(), linkedUser.isUserInHypixelGuild()]);

    let buttons: ButtonBuilder[];
    if (guildMember) {
      buttons = [
        new ButtonBuilder().setCustomId('kickUser').setLabel('Kick').setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId(guildMember.mutedUntil ? 'unmuteUser' : 'muteUser')
          .setLabel(guildMember.mutedUntil ? 'Unmute' : 'Mute')
          .setStyle(guildMember.mutedUntil ? ButtonStyle.Success : ButtonStyle.Danger),
        new ButtonBuilder().setCustomId('demoteUser').setLabel('Demote').setStyle(ButtonStyle.Danger),
        new ButtonBuilder().setCustomId('promoteUser').setLabel('Promote').setStyle(ButtonStyle.Success)
      ];
    } else {
      buttons = [new ButtonBuilder().setCustomId('inviteUser').setLabel('Invite').setStyle(ButtonStyle.Success)];
    }

    await interaction.followUp({
      embeds: [
        new SuccessEmbed()
          .setDescription(`\`${nickname}\` (\`${uuid}\`) is linked to <@${linkedUser.discordId}>.`)
          .setFields(
            { name: 'Discord ID', value: `\`\`\`${linkedUser.discordId}\`\`\`` },
            { name: 'UUID', value: `\`\`\`${uuid}\`\`\`` },
            { name: 'Username', value: `\`\`\`${nickname}\`\`\`` },
            { name: 'Formatted Username', value: `\`\`\`${formattedNickname}\`\`\`` },
            { name: 'Is in Guild', value: guildMember ? ':white_check_mark: Yes' : ':x: No' }
          )
          .setDevFooter('Kathund')
      ],
      components: [
        new ActionRowBuilder<ButtonBuilder>().addComponents(buttons),
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder().setCustomId('unverifyUser').setLabel('Force Unverify User').setStyle(ButtonStyle.Danger),
          new ButtonBuilder().setCustomId('updateUser').setLabel('Force Update User').setStyle(ButtonStyle.Success)
        )
      ]
    });
  }
}

export default LinkedCommand;
