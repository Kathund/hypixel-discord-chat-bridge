import DiscordUtils from '../Private/DiscordUtils.js';
import HypixelDiscordChatBridgeError from '../../Private/Error.js';
import { type BaseInteraction, type ButtonInteraction, type ChatInputCommandInteraction, GuildMember, type ModalSubmitInteraction } from 'discord.js';
import { CommandFlags } from '../../Types/Discord.js';
import type BasicInteractionData from '../Private/BasicInteractionData.js';
import type DiscordManager from '../DiscordManager.js';

class InteractionHandler {
  constructor(private readonly discord: DiscordManager) {}

  onInteraction(interaction: BaseInteraction) {
    if (interaction.isChatInputCommand()) this.discord.commandHandler.onCommand(interaction);
    if (interaction.isAutocomplete()) this.discord.commandHandler.onAutoComplete(interaction);
    if (interaction.isButton()) this.discord.buttonHandler.onButton(interaction);
    if (interaction.isModalSubmit()) this.discord.modalHandler.onSubmit(interaction);
  }

  async checkPerms(interaction: ChatInputCommandInteraction | ButtonInteraction | ModalSubmitInteraction, data: BasicInteractionData) {
    if (!interaction.guild || !interaction.member) throw new HypixelDiscordChatBridgeError('Please run this command inside of a guild');
    const member = interaction.member instanceof GuildMember ? interaction.member : await interaction.guild.members.fetch(interaction.user.id);

    const [isGuildMember, isStaffMember, isVerifiedMember] = await Promise.all([
      DiscordUtils.isGuildMember(member),
      DiscordUtils.isStaffMember(member),
      DiscordUtils.isVerifiedMember(member)
    ]);

    const checks: Array<[boolean, string]> = [
      [data.flags.includes(CommandFlags.GuildMemberOnly) && !isGuildMember, "You don't have permission to use this command."],
      [data.flags.includes(CommandFlags.StaffOnly) && !isStaffMember, "You don't have permission to use this command."],
      [data.flags.includes(CommandFlags.StatChannelsCommand) && !this.discord.Application.config.statsChannels.enabled, 'Stat Channel Commands are disbled.'],
      [data.flags.includes(CommandFlags.VerifiedOnly) && !isVerifiedMember, 'This command requires you to be verified. Please use /verify to verify.'],
      [data.flags.includes(CommandFlags.VerificationCommand) && !this.discord.Application.config.verification.enabled, 'Verification commands are disabled.'],
      [data.flags.includes(CommandFlags.RequiresMinecraftBot) && !this.discord.Application.minecraft.isBotOnline(), this.discord.Application.messages.minecraftBotOffline]
    ];

    for (const [failed, message] of checks) {
      if (failed) throw new HypixelDiscordChatBridgeError(message);
    }
  }
}

export default InteractionHandler;
