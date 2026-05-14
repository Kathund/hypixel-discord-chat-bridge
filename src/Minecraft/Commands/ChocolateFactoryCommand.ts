import Command from "../Private/Command.js";
import CommandData from "../Private/CommandData.js";
import CommandDataOption from "../Private/CommandDataOption.js";
import { FormatNumber } from "../../Utils/StringUtils.js";
import { getSelectedProfile } from "../../Utils/HypixelUtils.js";
import type { MinecraftManagerWithBot } from "../../Types/Minecraft.js";

class ChocolateFactoryCommand extends Command {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new CommandData()
      .setName("chocolatefactory")
      .setAliases(["cf", "factory", "chocolate"])
      .setOptions([new CommandDataOption().setName("username").setRequired(false)]);
  }

  override async execute(player: string, message: string) {
    const args = this.getArgs(message);
    player = args[0] || player;

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
