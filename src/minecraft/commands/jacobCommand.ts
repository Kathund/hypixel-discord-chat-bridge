import MinecraftCommand from "../private/commands/MinecraftCommand.ts";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.ts";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.ts";
import { formatNumber } from "../../utils/stringUtils.ts";
import { getSelectedProfile } from "../../utils/hypixelUtils.ts";

class JacobCommand extends MinecraftCommand {
  override readonly data = new MinecraftCommandData()
    .setName("jacob")
    .setDescription("Jacob's Contest Stats of specified user.")
    .setAliases(["jacobs", "jacobcontest", "contest"])
    .setOptions([new MinecraftCommandDataOption().setName("username").setDescription("Minecraft Username")])
    .setAuthors(["Amber"]);

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const { username, profile } = await getSelectedProfile(player);
    const { gold, silver, bronze } = profile.me.jacobContests.medals;
    const { doubleDrops, farmingLevelCap } = profile.me.jacobContests.perks;
    await this.send(
      `${username}'s Gold Medals: ${formatNumber(gold)} | Silver: ${formatNumber(silver)} | Bronze: ${formatNumber(bronze)} | Double Drops ${
        doubleDrops
      } / 15 | Level Cap: ${farmingLevelCap} / 10`
    );
  }
}

export default JacobCommand;
