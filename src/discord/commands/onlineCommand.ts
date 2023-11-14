import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { ChatMessage } from 'prismarine-chat';

export const data = new SlashCommandBuilder().setName('online').setDescription('List of online members.');

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const cachedMessages: string[] = [];
  const messages = new Promise((resolve, reject) => {
    const listener = (message: ChatMessage) => {
      const rawMessage = message.toString();

      cachedMessages.push(rawMessage);
      if (rawMessage.startsWith('Offline Members')) {
        global.bot.removeListener('message', listener);
        resolve(cachedMessages);
      }
    };

    global.bot.on('message', listener);
    global.bot.chat('/g online');

    setTimeout(() => {
      global.bot.removeListener('message', listener);
      reject('Command timed out. Please try again.');
    }, 5000);
  });

  const message = (await messages) as string[];

  const onlineMembers = message.find((msg: string) => msg.startsWith('Online Members: '));
  const totalMembers = message.find((msg: string) => msg.startsWith('Total Members: '));

  const onlineMembersList = message;
  const online = onlineMembersList
    .flatMap((item: string, index: number) => {
      if (item.includes('-- ') === false) return;

      const nextLine = onlineMembersList[index + 1];
      if (nextLine.includes('●')) {
        const rank = item.replaceAll('--', '').trim();
        const players = nextLine
          .split('●')
          .map((item: string) => item.trim())
          .filter((item: string) => item);

        if (rank === undefined || players === undefined) return;

        return `**${rank}**\n${players.map((item: string) => `\`${item}\``).join(', ')}`;
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
