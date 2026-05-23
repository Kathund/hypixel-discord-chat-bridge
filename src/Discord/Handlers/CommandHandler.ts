import DiscordUtils from '../Private/DiscordUtils.js';
import HypixelDiscordChatBridgeError from '../../Private/Error.js';
import { type ChatInputCommandInteraction, Collection, GuildMember, MessageFlags, REST, Routes } from 'discord.js';
import { CommandFlags, CommandResponse } from '../../Types/Discord.js';
import { readdirSync } from 'node:fs';
import type Command from '../Private/Commands/Command.js';
import type DiscordManager from '../DiscordManager.js';

class CommandHandler {
  constructor(private readonly discord: DiscordManager) {}

  async onCommand(interaction: ChatInputCommandInteraction): Promise<void> {
    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await interaction.deferReply({ flags: command.response === CommandResponse.Ephemeral ? MessageFlags.Ephemeral : undefined });
      console.discord(`Interaction Event trigged by ${interaction.user.username} (${interaction.user.id}) ran command ${interaction.commandName}`);

      if (!interaction.guild || !interaction.member) throw new HypixelDiscordChatBridgeError('Please run this command inside of a guild');
      const member = interaction.member instanceof GuildMember ? interaction.member : await interaction.guild.members.fetch(interaction.user.id);

      const [isGuildMember, isStaffMember, isVerifiedMember] = await Promise.all([
        DiscordUtils.isGuildMember(member),
        DiscordUtils.isStaffMember(member),
        DiscordUtils.isVerifiedMember(member)
      ]);

      const checks: Array<[boolean, string]> = [
        [command.flags.includes(CommandFlags.GuildMemberOnly) && !isGuildMember, "You don't have permission to use this command."],
        [command.flags.includes(CommandFlags.StaffOnly) && !isStaffMember, "You don't have permission to use this command."],
        [command.flags.includes(CommandFlags.StatChannelsCommand) && !this.discord.Application.config.statsChannels.enabled, 'Stat Channel Commands are disbled.'],
        [command.flags.includes(CommandFlags.VerifiedOnly) && !isVerifiedMember, "You don't have permission to use this command."],
        [command.flags.includes(CommandFlags.VerificationCommand) && !this.discord.Application.config.verification.enabled, 'Verification commands are disabled.'],
        [
          command.flags.includes(CommandFlags.RequiresMinecraftBot) && !this.discord.Application.minecraft.isBotOnline(),
          this.discord.Application.messages.minecraftBotOffline
        ]
      ];

      for (const [failed, message] of checks) {
        if (failed) throw new HypixelDiscordChatBridgeError(message);
      }

      await command.execute(interaction);
    } catch (error: unknown) {
      if (error instanceof Error || error instanceof HypixelDiscordChatBridgeError) {
        this.discord.utils.handleError(error, interaction);
      }
    }
  }

  async deployCommands(): Promise<void> {
    if (!this.discord.isClientOnline()) return;
    this.discord.client.commands = new Collection<string, Command>();
    const commandFiles = readdirSync('./src/Discord/Commands/', { recursive: true, encoding: 'utf-8' }).filter((file) => file.endsWith('.ts'));

    const commands = [];
    for (const file of commandFiles) {
      const command: Command = new (await import(`../Commands/${file}`)).default(this.discord);
      if (command.data.name) {
        if (command.flags.includes(CommandFlags.StatChannelsCommand) && !this.discord.Application.config.statsChannels.enabled) continue;
        if (command.flags.includes(CommandFlags.VerificationCommand) && !this.discord.Application.config.verification.enabled) continue;

        commands.push(command.data.toJSON());
        this.discord.client.commands.set(command.data.name, command);
      }
    }

    const rest = new REST({ version: '10' }).setToken(this.discord.Application.config.discord.bot.token);
    const clientID = Buffer.from(this.discord.Application.config.discord.bot.token.split('.')?.[0] || 'UNKNOWN', 'base64').toString('ascii');

    await rest
      .put(Routes.applicationGuildCommands(clientID, this.discord.Application.config.discord.bot.serverID), { body: commands })
      .then(() => console.discord(`Successfully reloaded ${commands.length} application command(s).`));
  }
}

export default CommandHandler;
