import Command from "../Private/Command.js";
import CommandData from "../Private/CommandData.js";
import CommandDataOption from "../Private/CommandDataOption.js";
import HypixelDiscordChatBridgeError from "../../Private/Error.js";
import type { MinecraftManagerWithBot } from "../../Types/Minecraft.js";

class EightBallCommand extends Command {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new CommandData()
      .setName("8ball")
      .setAliases(["8b"])
      .setOptions([new CommandDataOption().setName("question").setRequired(true)]);
  }

  override async execute(player: string, message: string) {
    if (this.getArgs(message).length === 0) throw new HypixelDiscordChatBridgeError("You must provide a question.");
    const request = await fetch("https://www.eightballapi.com/api");
    if (request.status !== 200) throw new HypixelDiscordChatBridgeError("Wouldn't you like to know weather boy.");
    const data = await request.json();
    if (data === undefined) throw new HypixelDiscordChatBridgeError("Wouldn't you like to know weather boy.");
    this.send(`${data.reading}`);
  }
}

export default EightBallCommand;
