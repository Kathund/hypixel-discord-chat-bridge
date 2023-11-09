import { discord as discordConfig, minecraft } from '../../config.json';
import { CommunicationBridge } from '../contracts/CommunicationBridge';
import { replaceVariables } from '../contracts/helperFunctions';
import { StateHandler } from './handlers/StateHandler';
import { ErrorHandler } from './handlers/ErrorHandler';
import { ChatHandler } from './handlers/ChatHandler';
import { CommandHandler } from './CommandHandler';
import { broadcastMessage } from '../Logger';
import { broadcast } from '../types/global';
import { createBot } from 'mineflayer';
import Filter from 'bad-words';

const filter = new Filter();

export class MinecraftManager extends CommunicationBridge {
  app: any;
  stateHandler: any;
  errorHandler: any;
  chatHandler: any;
  bot: any;
  constructor(app: any) {
    super();

    this.app = app;

    this.stateHandler = new StateHandler(this);
    this.errorHandler = new ErrorHandler(this);
    this.chatHandler = new ChatHandler(this, new CommandHandler(this), null);
  }

  connect() {
    global.bot = this.createBotConnection();
    this.bot = bot;

    this.errorHandler.registerEvents(this.bot);
    this.stateHandler.registerEvents(this.bot);
    this.chatHandler.registerEvents(this.bot);

    import('./other/eventNotifier');
    import('./other/skyblockNotifier.js');
  }

  createBotConnection() {
    return createBot({
      host: 'mc.hypixel.net',
      port: 25565,
      auth: 'microsoft',
      username: 'test',
      version: '1.8.9',
      viewDistance: 'tiny',
      chatLengthLimit: 256,
      profilesFolder: './auth-cache',
    });
  }

  async onBroadcast({ channel, username, message, replyingTo, discord }: broadcast) {
    broadcastMessage(`${username}: ${message}`, 'Minecraft');
    if (this.bot.player === undefined) {
      return;
    }

    if (channel === discordConfig.channels.debugChannel && discordConfig.channels.debugMode === true) {
      return this.bot.chat(message);
    }

    if (discordConfig.other.filterMessages) {
      message = filter.clean(message);
    }

    message = replaceVariables(minecraft.bot.messageFormat, { username, message });

    const chat = channel === discordConfig.channels.officerChannel ? '/oc' : '/gc';

    if (replyingTo) {
      message = message.replace(username, `${username} replying to ${replyingTo}`);
    }

    let successfullySent = false;
    const messageListener = (receivedMessage: any) => {
      receivedMessage = receivedMessage.toString();

      if (
        receivedMessage.includes(message) &&
        (this.chatHandler.isGuildMessage(receivedMessage) || this.chatHandler.isOfficerMessage(receivedMessage))
      ) {
        bot.removeListener('message', messageListener);
        successfullySent = true;
      }
    };

    bot.on('message', messageListener);
    this.bot.chat(`${chat} ${message}`);

    setTimeout(() => {
      bot.removeListener('message', messageListener);
      if (successfullySent === true) {
        return;
      }

      discord.react('❌');
    }, 500);
  }
}
