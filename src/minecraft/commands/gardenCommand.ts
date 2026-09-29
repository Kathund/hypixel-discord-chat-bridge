import HypixelDiscordChatBridgeError from "../../private/error.ts";
import MinecraftCommand from "../private/commands/MinecraftCommand.ts";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.ts";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.ts";
import { formatNumber, titleCaseCamel } from "../../utils/stringUtils.ts";
import { getSelectedProfile } from "../../utils/hypixelUtils.ts";

class GardenCommand extends MinecraftCommand {
  override readonly data = new MinecraftCommandData()
    .setName("garden")
    .setDescription("Skyblock Garden Stats of specified user.")
    .setOptions([new MinecraftCommandDataOption().setName("username").setDescription("Minecraft Username")])
    .setAuthors(["Amber"]);
  private readonly keyRemap: Record<string, string> = {
    "Nether Wart": "Wart",
    "Sugar Cane": "Cane",
    "Sun Flower": "SF",
    "Wild Rose": "WR",
    "Cocoa Beans": "Cocoa",
    "Average": "Avg"
  };

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const { username, profile } = await getSelectedProfile(player, { garden: true });
    if (profile.garden === null) throw new HypixelDiscordChatBridgeError(`${username} does not have a garden.`);

    const milestoneString = Object.entries(profile.garden.parsed.cropMilestones)
      .filter(([key]) => key !== "toString")
      .sort(([a], [b]) => {
        if (a === "average") return -1;
        if (b === "average") return 1;
        return a.localeCompare(b);
      })
      .map(([key, value]) => {
        const rawName = titleCaseCamel(key);
        const name = this.keyRemap[rawName] !== undefined ? this.keyRemap[rawName] : rawName;
        return `${name}: ${key === "average" ? formatNumber(value, 2) : value.level}`;
      })
      .join(" | ");

    await this.send(`${username}'s Garden ${profile.garden.parsed.level.level} | Milestones: ${milestoneString}`);
  }
}

export default GardenCommand;
