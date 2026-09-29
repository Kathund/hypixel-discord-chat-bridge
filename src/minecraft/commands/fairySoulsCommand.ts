import MinecraftCommand from "../private/commands/MinecraftCommand.ts";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.ts";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.ts";
import { getSelectedProfile } from "../../utils/hypixelUtils.ts";

class FairySoulsCommand extends MinecraftCommand {
  override readonly data = new MinecraftCommandData()
    .setName("fairysouls")
    .setDescription("Fairy Souls of specified user.")
    .setAliases(["fs", "fairysoul"])
    .setOptions([new MinecraftCommandDataOption().setName("username").setDescription("Minecraft Username")]);

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const { username, profile } = await getSelectedProfile(player);
    const { collected } = profile.me.fairySouls;
    const total = profile.gameMode === "island" ? 5 : 266;

    await this.send(`${username}'s Fairy Souls: ${collected} / ${total} | Progress: ${((collected / total) * 100).toFixed(2)}%`);
  }
}

export default FairySoulsCommand;
