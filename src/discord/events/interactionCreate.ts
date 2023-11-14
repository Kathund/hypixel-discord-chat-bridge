import { HypixelDiscordChatBridgeError } from '../../contracts/errorHandler';
import { EmbedBuilder, Interaction, TextChannel } from 'discord.js';
import { discordMessage } from '../../Logger';
import { discord } from '../../../config.json';

export const name = 'interactionCreate';
export const execute = async (interaction: Interaction) => {
  try {
    if (interaction.isChatInputCommand()) {
      try {
        await interaction.deferReply({ ephemeral: false }).catch(() => {});

        const command = interaction.client.commands.get(interaction.commandName);
        if (command === undefined) {
          return;
        }

        discordMessage(`${interaction.user.username} - [${interaction.commandName}]`);
        await command.execute(interaction);
      } catch (error: any) {
        console.log(error);

        const errrorMessage =
          error instanceof HypixelDiscordChatBridgeError === false
            ? 'Please try again later. The error has been sent to the Developers.\n\n'
            : '';
        const errorEmbed = new EmbedBuilder()
          .setColor(15548997)
          .setAuthor({ name: 'An Error has occurred' })
          .setDescription(`${errrorMessage}\`\`\`${error}\`\`\``)
          .setFooter({
            text: `by @duckysolucky | /help [command] for more information`,
            iconURL: 'https://imgur.com/tgwQJTX.png',
          });

        await interaction.editReply({ embeds: [errorEmbed] });

        if (error instanceof HypixelDiscordChatBridgeError === false) {
          const errorLog = new EmbedBuilder()
            .setColor(15158332)
            .setTitle('Error')
            .setDescription(
              `Command: \`${interaction.commandName}\`\nOptions: \`${JSON.stringify(
                interaction.options.data
              )}\`\nUser ID: \`${interaction.user.id}\`\nUser: \`${
                interaction.user.username ?? interaction.user.tag
              }\`\n\`\`\`${error.stack}\`\`\``
            )
            .setFooter({
              text: `by DuckySoLucky#5181`,
              iconURL: 'https://imgur.com/tgwQJTX.png',
            });

          await (interaction.client.channels.cache.get(discord.channels.loggingChannel) as TextChannel).send({
            content: discord.commands.commandRoles.map((role) => `<@&${role}>`).join(' '),
            embeds: [errorLog],
          });
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};
