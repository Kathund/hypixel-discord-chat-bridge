import Command from "../Private/Commands/Command.js";
import CommandData from "../Private/Commands/CommandData.js";
import MowojangAPI from "../../Private/MowojangAPI.js";
import { ChatInputCommandInteraction } from "discord.js";
import { CommandFlags, type DiscordManagerWithBot } from "../../Types/Discord.js";
import { ErrorEmbed, SuccessEmbed } from "../Private/Embed.js";

class UpdateCommand extends Command<DiscordManagerWithBot> {
  discordId: string | null;
  isSelf: boolean;
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new CommandData().setName("update").setDescription("Update your current roles");
    this.flags = [CommandFlags.RequiresMinecraftBot, CommandFlags.VerificationCommand];
    this.discordId = null;
    this.isSelf = false;
  }

  override async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    if (this.discordId === null) {
      this.isSelf = true;
      this.discordId = interaction.user.id;
    }
    const linkedUser = await this.discord.app.linked.updateLinkedUsersRolesByDiscordId(this.discordId);
    if (linkedUser === null) {
      await interaction.followUp({
        embeds: [
          new ErrorEmbed()
            .setDescription("User is not verified")
            .setFooter({ text: "by @.kathund | /help [command] for more information", iconURL: "https://i.imgur.com/uUuZx2E.png" })
        ]
      });
      return;
    }
    await interaction.followUp({
      embeds: [
        new SuccessEmbed()
          .setDescription(
            `Successfully synced ${this.isSelf ? "your" : `<@${this.discordId}>`} roles with \`${await MowojangAPI.getUsername(linkedUser.uuid)}\`'s stats!`
          )
          .setFooter({ text: "by @.kathund | /help [command] for more information", iconURL: "https://i.imgur.com/uUuZx2E.png" })
      ]
    });
  }
}

export default UpdateCommand;
