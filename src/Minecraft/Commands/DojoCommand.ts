import Command from "../Private/Command.js";
import CommandData from "../Private/CommandData.js";
import CommandDataOption from "../Private/CommandDataOption.js";
import { FormatNumber } from "../../Utils/StringUtils.js";
import { getSelectedProfile } from "../../Utils/HypixelUtils.js";
import type { MinecraftManagerWithBot } from "../../Types/Minecraft.js";

class DojoCommand extends Command {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new CommandData()
      .setName("dojo")
      .setAliases([])
      .setOptions([new CommandDataOption().setName("username").setRequired(false)]);
  }

  override async execute(player: string, message: string) {
    const args = this.getArgs(message);
    player = args[0] || player;

    const { username, profile } = await getSelectedProfile(player);
    const { belt, control, stamina, discipline, force, mastery, swiftness, tenacity } = profile.me.crimsonIsle.dojo;

    this.send(
      `${username}'s Belt: ${belt} | Best Force: ${FormatNumber(force.points)} | Best Stamina: ${FormatNumber(stamina.points)} | Best Mastery: ${FormatNumber(
        mastery.points
      )} | Best Discipline: ${FormatNumber(discipline.points)} | Best Swiftness: ${FormatNumber(swiftness.points)} | Best Control: ${FormatNumber(
        control.points
      )} | Best Tenacity: ${FormatNumber(tenacity.points)}`
    );
  }
}

export default DojoCommand;
