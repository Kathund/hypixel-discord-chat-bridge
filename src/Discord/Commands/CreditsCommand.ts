import Command from '../Private/Commands/Command.js';
import CommandData from '../Private/Commands/CommandData.js';
import Embed from '../Private/Embed.js';
import { CommonDevs, MiscCredits } from '../../Private/Constants.js';
import { DevTypes } from '../../Types/Misc.js';
import type { ChatInputCommandInteraction } from 'discord.js';
import type { DiscordManagerWithClient } from '../../Types/Discord.js';

class CreditsCommand extends Command {
  constructor(discord: DiscordManagerWithClient) {
    super(discord);
    this.data = new CommandData().setName('credits').setDescription('Shows the credits of the people who make this possible');
  }

  override async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const miscCredits = MiscCredits.map(({ name, description, link }) => `- **[${name}](<https://${link}>):** ${description}`).join('\n');
    const embed = new Embed()
      .setTitle('**Credits**')
      .addFields(
        DevTypes.map((type) => {
          return {
            name: `**${type}**`,
            value: Object.values(CommonDevs)
              .filter((data) => data.type === type)
              .sort((a, b) => a.username.localeCompare(b.username))
              .map(({ username, github, id }) => `@${username} (<@${id}>) - [Github](<https://github.com/${github ?? username}>)`)
              .join('\n')
          };
        })
      )
      .addFields({ name: '**Misc**', value: `Below are some tools/projects that this bot utilizes to stay a float\n${miscCredits}` })
      .addFields({
        name: '**Support**',
        value: `If you need any support please reach out to the maintainers: ${Object.values(CommonDevs)
          .filter(({ type }) => type === 'Maintainer')
          .map(({ username }) => `@${username}`)}`
      });

    await interaction.followUp({ embeds: [embed] });
  }
}

export default CreditsCommand;
