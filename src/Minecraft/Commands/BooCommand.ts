import Command from '../Private/Command.js';
import CommandData from '../Private/CommandData.js';
import CommandDataOption from '../Private/CommandDataOption.js';
import HypixelDiscordChatBridgeError from '../../Private/Error.js';
import { Delay } from '../../Utils/MiscUtils.js';
import type { MinecraftManagerWithBot } from '../../Types/Minecraft.js';

// CREDITS: by @Zickles (https://github.com/Zickles)
class BooCommand extends Command {
  isOnCooldown: boolean;
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new CommandData()
      .setName('boop')
      .setDescription('Boo someone!')
      .setOptions([new CommandDataOption().setName('username').setRequired(true)]);

    this.isOnCooldown = false;
  }

  override async execute(player: string, message: string) {
    try {
      const args = this.getArgs(message);
      if (args.length === 0) throw new HypixelDiscordChatBridgeError("You must provide a user to boo!'");
      if (new Date().getMonth() !== 9) throw new HypixelDiscordChatBridgeError('You can only do this during Halloween!');
      if (this.isOnCooldown) throw new HypixelDiscordChatBridgeError(`${player} Command is on cooldown`);

      this.isOnCooldown = true;
      this.minecraft.bot.chat(`/boo ${args[0]}`);
      await Delay(1000);
      this.minecraft.bot.chat(`/msg ${args[0]} ${player} Booed You!`);
      await Delay(1000);
      this.send(`Booed ${args[0]}!`);
      setTimeout(() => (this.isOnCooldown = false), 30000);
    } catch (error) {
      this.isOnCooldown = false;
      throw error;
    }
  }
}

export default BooCommand;
