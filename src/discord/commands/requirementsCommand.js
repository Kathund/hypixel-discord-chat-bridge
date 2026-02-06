import DiscordCommand from "../../contracts/DiscordCommand.js";
import HypixelAPI from "../../contracts/API/HypixelAPI.js";
import HypixelDiscordChatBridgeError from "../../contracts/errorHandler.js";
import config from "../../../config.json" with { type: "json" };
import { Embed } from "../../contracts/embedHandler.js";
import { SlashCommandBuilder } from "discord.js";
import { getLatestProfile } from "../../../API/functions/getLatestProfile.js";
import { getUUID } from "../../contracts/API/mowojangAPI.js";

export async function checkRequirements(uuid) {
  const [player, profile] = await Promise.all([HypixelAPI.getPlayer(uuid), getLatestProfile(uuid)]);
  let meetRequirements = false;

  const skyblockLevel = (profile.profile?.leveling?.experience || 0) / 100 || 0;

  const bwLevel = player.stats.bedwars.level;
  const bwFKDR = player.stats.bedwars.finalKDRatio;

  const swLevel = player.stats.skywars.level / 5;
  const swKDR = player.stats.skywars.KDRatio;

  const duelsWins = player.stats.duels.wins;
  const dWLR = player.stats.duels.WLRatio;

  if (skyblockLevel >= config.minecraft.guildRequirements.requirements.skyblockLevel && config.minecraft.guildRequirements.requirements.skyblockLevel > 0) {
    meetRequirements = true;
  }

  if (bwLevel >= config.minecraft.guildRequirements.requirements.bedwarsStars && config.minecraft.guildRequirements.requirements.bedwarsStars > 0) {
    meetRequirements = true;
  }
  if (bwFKDR >= config.minecraft.guildRequirements.requirements.bedwarsFKDR && config.minecraft.guildRequirements.requirements.bedwarsFKDR > 0) {
    meetRequirements = true;
  }

  if (swLevel >= config.minecraft.guildRequirements.requirements.skywarsStars && config.minecraft.guildRequirements.requirements.skywarsStars > 0) {
    meetRequirements = true;
  }

  if (swKDR >= config.minecraft.guildRequirements.requirements.skywarsKDR && config.minecraft.guildRequirements.requirements.skywarsKDR > 0) {
    meetRequirements = true;
  }

  if (duelsWins >= config.minecraft.guildRequirements.requirements.duelsWins && config.minecraft.guildRequirements.requirements.duelsWins > 0) {
    meetRequirements = true;
  }

  if (dWLR >= config.minecraft.guildRequirements.requirements.duelsWLR && config.minecraft.guildRequirements.requirements.duelsWLR > 0) {
    meetRequirements = true;
  }

  return {
    meetRequirements,
    level: player.level,
    nickname: player.nickname,
    skyblockLevel: skyblockLevel.toLocaleString(),
    bwLevel: bwLevel.toLocaleString(),
    bwFKDR: bwFKDR.toLocaleString(),
    swLevel: swLevel.toLocaleString(),
    swKDR: swKDR.toLocaleString(),
    duelsWins: duelsWins.toLocaleString(),
    dWLR: dWLR.toLocaleString()
  };
}

export function generateEmbed(data) {
  return new Embed()
    .setColor(data.meetRequirements ? 2067276 : 15548997)
    .setTitle(`${data.nickname} **${data.meetRequirements ? "has" : "hasn't"}** got the requirements to join the Guild!`)
    .addFields(
      {
        name: "Bedwars Level",
        value: `${data.bwLevel}/${config.minecraft.guildRequirements.requirements.bedwarsStars.toLocaleString()}`,
        inline: true
      },
      {
        name: "Skywars Level",
        value: `${data.swLevel}/${config.minecraft.guildRequirements.requirements.skywarsStars.toLocaleString()}`,
        inline: true
      },
      {
        name: "Duels Wins",
        value: `${data.duelsWins}/${config.minecraft.guildRequirements.requirements.duelsWins.toLocaleString()}`,
        inline: true
      },
      {
        name: "Bedwars FKDR",
        value: `${data.bwFKDR}/${config.minecraft.guildRequirements.requirements.bedwarsFKDR.toLocaleString()}`,
        inline: true
      },
      {
        name: "Skywars KDR",
        value: `${data.swKDR}/${config.minecraft.guildRequirements.requirements.skywarsKDR.toLocaleString()}`,
        inline: true
      },
      {
        name: "Duels WLR",
        value: `${data.dWLR}/${config.minecraft.guildRequirements.requirements.duelsWLR.toLocaleString()}`,
        inline: true
      },
      {
        name: "Skyblock Level",
        value: `${data.skyblockLevel}/${config.minecraft.guildRequirements.requirements.skyblockLevel.toLocaleString()}`,
        inline: true
      }
    )
    .setThumbnail(`https://www.mc-heads.net/avatar/${data.nickname}`)
    .setFooter({
      text: `by @duckysolucky | /help [command] for more information`,
      iconURL: "https://imgur.com/tgwQJTX.png"
    });
}

class RequirementsCommand extends DiscordCommand {
  /** @param {import("../discord/DiscordManager.js").default} discord */
  constructor(discord) {
    super(discord);
    this.data = new SlashCommandBuilder()
      .setName("requirements")
      .setDescription("Check a user's requirements to join the guild")
      .addStringOption((option) => option.setName("username").setDescription("Minecraft Username"));
  }

  /** @param {import("discord.js").ChatInputCommandInteraction} interaction */
  async onCommand(interaction) {
    const name = interaction.options.getString("username") || interaction?.member?.nickname || null;
    if (name === null) throw new HypixelDiscordChatBridgeError("Please input a username");
    const playerInfo = await checkRequirements(await getUUID(name));
    const embed = generateEmbed(playerInfo);
    await interaction.followUp({ embeds: [embed] });
  }
}

export default RequirementsCommand;
