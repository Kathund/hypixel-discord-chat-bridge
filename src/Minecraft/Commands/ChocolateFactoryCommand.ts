import Command from '../Private/Command.js';
import CommandData from '../Private/CommandData.js';
import CommandDataOption from '../Private/CommandDataOption.js';
import { FormatNumber } from '../../Utils/StringUtils.js';
import { getSelectedProfile } from '../../Utils/HypixelUtils.js';
import type { MinecraftManagerWithBot } from '../../Types/Minecraft.js';

// CREDITS: by @Kathund (https://github.com/Kathund)
class ChocolateFactoryCommand extends Command {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new CommandData()
      .setName('chocolatefactory')
      .setDescription('Skyblock Chocolate Factory Stats of specified user.')
      .setAliases(['cf', 'factory', 'chocolate'])
      .setOptions([new CommandDataOption().setName('username').setDescription('Minecraft Username')]);
  }

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const { username, profile } = await getSelectedProfile(player);
    const { prestige, totalChocolate, currentChocolate, employees } = profile.me.chocolateFactory;
    const { bro, cousin, sis, father, grandma, dog, uncle } = employees;

    this.send(
      `${username}'s Chocolate Prestige: ${prestige} | Chocolate: ${FormatNumber(currentChocolate)} | Total Chocolate: ${FormatNumber(
        totalChocolate
      )} | Employees: Bro: ${bro}, Cousin: ${cousin}, Sis: ${sis}, Father: ${father}, Grandma: ${grandma}, Dog: ${dog}, Uncle: ${uncle}`
    );
  }
}

export default ChocolateFactoryCommand;
