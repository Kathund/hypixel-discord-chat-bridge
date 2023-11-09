const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
import { minecraftCommand } from '../../contracts/minecraftCommand';

export default class warpoutCommand extends minecraftCommand {
  name: string;
  aliases: string[];
  description: string;
  options: never[];
  isOnCooldown: boolean;
  constructor(minecraft: any) {
    super(minecraft);
    this.name = 'warpout';
    this.aliases = ['warp'];
    this.description = 'Warp player out of the game';
    this.options = [];
    this.isOnCooldown = false;
  }
  async onCommand(username: any, message: any) {
    try {
      if (this.isOnCooldown) {
        return this.send(`/gc ${username} Command is on cooldown`);
      }

      this.isOnCooldown = true;

      const user = this.getArgs(message)[0];
      if (user === undefined) {
        // eslint-disable-next-line no-throw-literal
        throw 'Please provide a username!';
      }
      this.send('/lobby megawalls');
      await delay(250);
      this.send('/play skyblock');

      const warpoutListener = async (message: any) => {
        message = message.toString();

        if (message.includes("You cannot invite that player since they're not online.")) {
          global.bot.removeListener('message', warpoutListener);
          this.isOnCooldown = false;

          this.send(`/gc ${user} is not online!`);
        } else if (message.includes('You cannot invite that player!')) {
          global.bot.removeListener('message', warpoutListener);
          this.isOnCooldown = false;

          this.send(`/gc ${user} has party requests disabled!`);
        } else if (message.includes('invited') && message.includes('to the party! They have 60 seconds to accept.')) {
          this.send(`/gc Successfully invited ${user} to the party!`);
        } else if (message.includes(' joined the party.')) {
          this.send(`/gc ${user} joined the party! Warping them out of the game..`);
          this.send('/p warp');
        } else if (message.includes('warped to your server')) {
          global.bot.removeListener('message', warpoutListener);
          this.isOnCooldown = false;
          this.send(`/gc ${user} warped out of the game! Disbanding party..`);
          this.send('/p disband');

          await delay(1500);
          this.send('\u00a7');
        } else if (message.includes(' cannot warp from Limbo')) {
          global.bot.removeListener('message', warpoutListener);
          this.isOnCooldown = false;
          this.send(`/gc ${user} cannot be warped from Limbo! Disbanding party..`);
          this.send('/p disband');
        } else if (message.includes(' is not allowed on your server!')) {
          global.bot.removeListener('message', warpoutListener);
          this.isOnCooldown = false;
          this.send(`/gc ${user} is not allowed on my server! Disbanding party..`);

          this.send('/p leave');
          await delay(1500);
          this.send('\u00a7');
        } else if (message.includes('You are not allowed to invite players.')) {
          global.bot.removeListener('message', warpoutListener);
          this.isOnCooldown = false;
          this.send(`/gc Somehow I'm not allowed to invite players? Disbanding party..`);

          this.send('/p disband');
          await delay(1500);
          this.send('\u00a7');
        } else if (message.includes('You are not allowed to disband this party.')) {
          global.bot.removeListener('message', warpoutListener);
          this.isOnCooldown = false;
          this.send(`/gc Somehow I'm not allowed to disband this party? Leaving party..`);

          this.send('/p leave');
          await delay(1500);
          this.send('\u00a7');
        } else if (message.includes("You can't party warp into limbo!")) {
          global.bot.removeListener('message', warpoutListener);
          this.isOnCooldown = false;
          this.send(`/gc Somehow I'm inside in limbo? Disbanding party..`);
          this.send('/p disband');
        } else if (message.includes("Couldn't find a player with that name!")) {
          global.bot.removeListener('message', warpoutListener);
          this.isOnCooldown = false;

          this.send(`/gc Couldn't find a player with that name!`);
          this.send('/p disband');
        } else if (message.includes('You cannot party yourself!')) {
          global.bot.removeListener('message', warpoutListener);
          this.isOnCooldown = false;

          this.send(`/gc I cannot party yourself!`);
        } else if (message.includes("didn't warp correctly!")) {
          global.bot.removeListener('message', warpoutListener);
          this.isOnCooldown = false;

          this.send(`/gc ${user} didn't warp correctly! Please try again..`);
          this.send('/p disband');
        }
      };

      global.bot.on('message', warpoutListener);
      this.send(`/p ${user} `);
      setTimeout(() => {
        global.bot.removeListener('message', warpoutListener);

        if (this.isOnCooldown === true) {
          this.send('/gc Party timed out');
          this.send('/p disband');
          this.send('\u00a7');

          this.isOnCooldown = false;
        }
      }, 30000);
    } catch (error) {
      this.send(`/gc ${username} [ERROR] ${error || 'Something went wrong..'}`);
      this.isOnCooldown = false;
    }
  }
}
