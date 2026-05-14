import Command from "../Private/Command.js";
import CommandData from "../Private/CommandData.js";
import CommandDataOption from "../Private/CommandDataOption.js";
import { FormatNumber } from "../../Utils/StringUtils.js";
import { getSelectedProfile } from "../../Utils/HypixelUtils.js";
import type { MinecraftManagerWithBot } from "../../Types/Minecraft.js";

class JacobCommand extends Command {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new CommandData()
      .setName("jacob")
      .setAliases(["jacobs", "jacobcontest", "contest"])
      .setOptions([new CommandDataOption().setName("username").setRequired(false)]);
  }

  override async execute(player: string, message: string) {
    const args = this.getArgs(message);
    player = args[0] || player;

    const { username, profile } = await getSelectedProfile(player);

    const { gold, silver, bronze } = profile.me.jacobContests.medals;
    const { doubleDrops, farmingLevelCap } = profile.me.jacobContests.perks;

    this.send(
      `${username}'s Gold Medals: ${FormatNumber(gold)} | Silver: ${FormatNumber(silver)} | Bronze: ${FormatNumber(bronze)} | Double Drops ${
        doubleDrops
      } / 15 | Level Cap: ${farmingLevelCap} / 10`
    );
  }
}

export default JacobCommand;
