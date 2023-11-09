import { minecraftCommand } from '../../contracts/minecraftCommand';
import { getRandomWord, scrambleWord } from '../constants/words';

const getWord = (message: any) => message.split(' ').pop();

const cooldowns = new Map();

export class unscrambleCommand extends minecraftCommand {
  name: string;
  aliases: string[];
  description: string;
  options: { name: string; description: string; required: boolean }[];
  cooldown: number;
  constructor(minecraft: any) {
    super(minecraft);

    this.name = 'unscramble';
    this.aliases = ['unscramble', 'unscrambleme', 'us'];
    this.description = 'Unscramble the word and type it in chat to win!';
    this.options = [
      {
        name: 'length',
        description: 'Length of the word to unscramble',
        required: false,
      },
    ];
    this.cooldown = 30 * 1000;
  }

  async onCommand(username: any, message: any) {
    try {
      const userUsername = username;
      const length = this.getArgs(message)[0];
      const answer = getRandomWord(length);
      const scrambledWord = scrambleWord(answer);

      const cooldownDuration = this.cooldown;

      if (cooldowns.has(this.name)) {
        const lastTime = cooldowns.get(this.name);
        const elapsedTime = Date.now() - lastTime;
        const remainingTime = cooldownDuration - elapsedTime;

        if (remainingTime > 0) {
          return this.send(`/gc Please wait until current game is over.`);
        }
      }

      let answered = false;
      cooldowns.set(this.name, Date.now());
      const listener = (username: any, message: any) => {
        if (getWord(message) === answer) {
          this.send(
            `/gc ${userUsername} guessed it right! Time elapsed: ${(Date.now() - startTime).toLocaleString()}ms!`
          );

          bot.removeListener('chat', listener);
          answered = true;
          cooldowns.delete(this.name);
        }
      };

      bot.on('chat', listener);
      this.send(`/gc Unscramble the following word: "${scrambledWord}"`);
      const startTime = Date.now();

      setTimeout(() => {
        bot.removeListener('chat', listener);
        cooldowns.delete(this.name);

        if (answered === false) {
          this.send(`/gc Time's up! The answer was ${answer}`);
        }
      }, 30000);
    } catch (error) {
      this.send(`/gc [ERROR] ${error || 'Something went wrong..'}`);
    }
  }
}
