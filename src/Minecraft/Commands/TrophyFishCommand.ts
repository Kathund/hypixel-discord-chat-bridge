import Command from "../Private/Command.js";
import CommandData from "../Private/CommandData.js";
import CommandDataOption from "../Private/CommandDataOption.js";
import { FormatNumber } from "../../Utils/StringUtils.js";
import { getSelectedProfile } from "../../Utils/HypixelUtils.js";
import type { MinecraftManagerWithBot } from "../../Types/Minecraft.js";
import type { SkyBlockMemberCrimsonIsleTrophyFish, SkyBlockMemberCrimsonIsleTrophyFishFish } from "hypixel-api-reborn";

class TrophyFishCommand extends Command {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new CommandData()
      .setName("trophyfish")
      .setAliases(["tf", "trophyfishing", "trophy"])
      .setOptions([new CommandDataOption().setName("username").setRequired(false)]);
  }

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const { username, profile } = await getSelectedProfile(player);

    const trophyFishing = profile.me.crimsonIsle.trophyFishing;
    const { rank } = trophyFishing;
    const { bronze, silver, gold, diamond, total } = trophyFishing.caught;

    let uniqueBronze = 0;
    let uniqueSilver = 0;
    let uniqueGold = 0;
    let uniqueDiamond = 0;
    const uniqueFish = 18;
    (Object.keys(trophyFishing) as (keyof SkyBlockMemberCrimsonIsleTrophyFish)[])
      .filter((fish) => !["toString", "rank", "caught"].includes(fish as string))
      .forEach((fishName) => {
        const fish = trophyFishing[fishName] as SkyBlockMemberCrimsonIsleTrophyFishFish;
        if (fish.bronze > 1) uniqueBronze++;
        if (fish.gold > 1) uniqueSilver++;
        if (fish.gold > 1) uniqueGold++;
        if (fish.diamond > 1) uniqueDiamond++;
      });

    this.send(
      `${username}'s Trophy Fishing rank: ${rank} | Caught: ${FormatNumber(total)} | Bronze: ${uniqueBronze}/${uniqueFish} (${FormatNumber(bronze)}) | Silver: ${
        uniqueSilver
      }/${uniqueFish} (${FormatNumber(silver)}) | Gold: ${uniqueGold}/${uniqueFish} (${FormatNumber(gold)}) | Diamond: ${uniqueDiamond}/${uniqueFish} (${FormatNumber(
        diamond
      )})`
    );
  }
}

export default TrophyFishCommand;
