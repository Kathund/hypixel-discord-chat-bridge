import { ChatInputCommandInteraction, EmbedBuilder, GuildMember, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder().setName('online').setDescription('List of online members.');

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const cachedMessages: any = [];
  const messages = new Promise((resolve, reject) => {
    const listener = (message: any) => {
      message = message.toString();

      cachedMessages.push(message);
      if (message.startsWith('Offline Members')) {
        bot.removeListener('message', listener);
        resolve(cachedMessages);
      }
    };

    bot.on('message', listener);
    bot.chat('/g online');

    setTimeout(() => {
      bot.removeListener('message', listener);
      reject('Command timed out. Please try again.');
    }, 5000);
  });

  const message: any = await messages;

  const onlineMembers = message.find((m: any) => m.startsWith('Online Members: '));
  const totalMembers = message.find((message: any) => message.startsWith('Total Members: '));

  const onlineMembersList = message;
  const online = onlineMembersList
    .flatMap((item: any, index: any) => {
      if (item.includes('-- ') === false) return;

      const nextLine = onlineMembersList[parseInt(index) + 1];
      if (nextLine.includes('●')) {
        const rank = item.replaceAll('--', '').trim();
        const players = nextLine
          .split('●')
          .map((item: any) => item.trim())
          .filter((item: any) => item);

        if (rank === undefined || players === undefined) return;

        return `**${rank}**\n${players.map((item: any) => `\`${item}\``).join(', ')}`;
      }
    })
    .filter((item: any) => item);

  const description = `${totalMembers}\n${onlineMembers}\n\n${online.join('\n')}`;
  const embed = new EmbedBuilder()
    .setColor('#2ECC71')
    .setTitle('Online Members')
    .setDescription(description)
    .setFooter({
      text: 'by @duckysolucky | /help [command] for more information',
      iconURL: 'https://imgur.com/tgwQJTX.png',
    });

  return await interaction.followUp({ embeds: [embed] });
};
