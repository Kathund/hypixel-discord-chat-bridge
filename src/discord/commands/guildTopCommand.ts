import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('guildtop')
  .setDescription('Top 10 members with the most guild experience.')
  .addNumberOption((option) =>
    option.setName('time').setDescription('Days Ago').setRequired(false).setMinValue(1).setMaxValue(7)
  );

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const time = interaction.options.getString('time');

  const cachedMessages: any = [];
  const messages = new Promise((resolve, reject) => {
    const listener = (message: any) => {
      message = message.toString();
      cachedMessages.push(message);

      if (message.startsWith('10.') && message.endsWith('Guild Experience')) {
        global.bot.removeListener('message', listener);
        resolve(cachedMessages);
      }
    };

    global.bot.on('message', listener);
    global.bot.chat(`/g top ${time || ''}`);

    setTimeout(() => {
      global.bot.removeListener('message', listener);
      reject('Command timed out. Please try again.');
    }, 5000);
  });

  const message: any = await messages;

  const trimmedMessages = message.map((message: any) => message.trim()).filter((message: any) => message.includes('.'));
  const description = trimmedMessages
    .map((message: any) => {
      const [position, , name, guildExperience] = message.split(' ');

      return `\`${position}\` **${name}** - \`${guildExperience}\` Guild Experience\n`;
    })
    .join('');

  const embed = new EmbedBuilder()
    .setColor('#2ECC71')
    .setTitle('Top 10 Guild Members')
    .setDescription(description)
    .setFooter({
      text: 'by @duckysolucky | /help [command] for more information',
      iconURL: 'https://imgur.com/tgwQJTX.png',
    });

  return await interaction.followUp({ embeds: [embed] });
};
