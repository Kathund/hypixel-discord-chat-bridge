import Command from "../Private/Command.js";
import CommandData from "../Private/CommandData.js";
import CommandDataOption from "../Private/CommandDataOption.js";
import HypixelDiscordChatBridgeError from "../../Private/Error.js";
import { getSelectedProfile } from "../../Utils/HypixelUtils.js";
import type { MinecraftManagerWithBot } from "../../Types/Minecraft.js";

class GardenCommand extends Command {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new CommandData()
      .setName("garden")
      .setAliases([])
      .setOptions([new CommandDataOption().setName("username").setRequired(false)]);
  }

  override async execute(player: string, message: string) {
    const args = this.getArgs(message);
    player = args[0] || player;

    const { username, profile } = await getSelectedProfile(player, { garden: true });
    if (profile.garden === null) throw new HypixelDiscordChatBridgeError(`${username} does not have a garden.`);
    const { wheat, carrot, sugarCane, potato, netherWart, pumpkin, melon, mushroom, cocoaBeans, cactus } = profile.garden.cropMilestones;

    this.send(
      `${username}'s Garden ${profile.garden.level.level} | Crop Milestones: Wheat: ${wheat.level} | Carrot: ${carrot.level} | Cane: ${sugarCane.level} | Potato: ${
        potato.level
      } | Wart: ${netherWart.level} | Pumpkin: ${pumpkin.level} | Melon: ${melon.level} | Mushroom: ${mushroom.level} | Cocoa: ${cocoaBeans.level} | Cactus: ${
        cactus.level
      }`
    );
  }
}

export default GardenCommand;
