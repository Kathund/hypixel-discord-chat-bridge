import Command from "../Private/Command.js";
import CommandData from "../Private/CommandData.js";
import CommandDataOption from "../Private/CommandDataOption.js";
import HypixelDiscordChatBridgeError from "../../Private/Error.js";
import { FormatNumber, TitleCase } from "../../Utils/StringUtils.js";
import { getSelectedProfile } from "../../Utils/HypixelUtils.js";
import type { MinecraftManagerWithBot } from "../../Types/Minecraft.js";
import type { SkillLevelData } from "hypixel-api-reborn";

class SkillsCommand extends Command {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new CommandData()
      .setName("skills")
      .setDescription("Skills and Skill Average of specified user.")
      .setAliases(["skill", "sa"])
      .setOptions([new CommandDataOption().setName("username").setDescription("Minecraft Username")]);
  }

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const { username, profile } = await getSelectedProfile(player);

    const skillData: { name: string; level: number }[] = [];
    const skills = profile.me.playerData.skills;
    Object.keys(skills)
      .filter((skill) => !["average", "nonCosmeticAverage", "toString"].includes(skill))
      .filter((skill) => {
        const data: SkillLevelData = skills[skill as keyof typeof skills] as SkillLevelData;
        return data.currentXp > 1;
      })
      .forEach((skill) => {
        const data: SkillLevelData = skills[skill as keyof typeof skills] as SkillLevelData;
        skillData.push({ name: skill, level: data.level });
      });

    if (skillData.length === 0) throw new HypixelDiscordChatBridgeError(`${username} has no skills.`);

    this.send(`${username}'s Skill Average: ${skills.average ?? 0} (${skillData.map((skill) => `${TitleCase(skill.name)}: ${FormatNumber(skill.level)}`).join(", ")})`);
  }
}

export default SkillsCommand;
