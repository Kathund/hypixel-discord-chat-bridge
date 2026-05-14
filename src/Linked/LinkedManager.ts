import HypixelAPIReborn from "../Private/HypixelAPIReborn.js";
import HypixelDiscordChatBridgeError from "../Private/Error.js";
import { FormatNumber, ReplaceVariables } from "../Utils/StringUtils.js";
import { getNetworthCalculator, getSelectedProfile } from "../Utils/HypixelUtils.js";
import { readFileSync, writeFileSync } from "node:fs";
import type Application from "../Application.js";
import type { Guild, Player, SkyBlockMember, SkyblockProfileWithMe } from "hypixel-api-reborn";
import type { LinkedData, LinkedUser } from "../Types/Linked.js";

class LinkedManager {
  readonly app: Application;
  constructor(app: Application) {
    this.app = app;
  }

  getLinkedFile(): LinkedData {
    const linkedData = readFileSync("data/linked.json");
    if (!linkedData) throw new HypixelDiscordChatBridgeError("The linked data file does not exist. Please contact an administrator.");
    const linked = JSON.parse(linkedData.toString());
    if (!linked) throw new HypixelDiscordChatBridgeError("The linked data file is malformed. Please contact an administrator.");
    return linked;
  }

  unparseLinkedData(data: LinkedUser[]): LinkedData {
    return data.reduce<LinkedData>((acc, user) => {
      acc[user.uuid] = user.discordId;
      return acc;
    }, {});
  }

  parseLinkedData(data: LinkedData): LinkedUser[] {
    return Object.entries(data).map(([uuid, discordId]) => ({ uuid, discordId }));
  }

  getLinkedUsers(): LinkedUser[] {
    return this.parseLinkedData(this.getLinkedFile());
  }

  writeLinkedUsers(data: LinkedData): LinkedUser[] {
    writeFileSync("./data/linked.json", JSON.stringify(data, null, 2));
    return this.parseLinkedData(data);
  }

  writeLinkedUsersParsed(users: LinkedUser[]): LinkedUser[] {
    return this.writeLinkedUsers(this.unparseLinkedData(users));
  }

  getLinkedUser(linkedUser: LinkedUser): LinkedUser | undefined {
    const users = this.getLinkedUsers();
    return users.find((user) => user === linkedUser);
  }

  getLinkedUserByDiscordId(discordId: string): LinkedUser | undefined {
    const users = this.getLinkedUsers();
    return users.find((user) => user.discordId === discordId);
  }

  getLinkedUserByUUID(UUID: string): LinkedUser | undefined {
    const users = this.getLinkedUsers();
    return users.find((user) => user.uuid === UUID);
  }

  linkUser(uuid: string, discordId: string): LinkedUser[] {
    const linked = this.getLinkedUsers();
    const parsed: LinkedUser = { uuid, discordId };
    // todo something something delete the old? i'm not sure
    linked.push(parsed);
    return this.writeLinkedUsersParsed(linked);
  }

  linkUserParsed(user: LinkedUser): LinkedUser[] {
    const linked = this.getLinkedUsers();
    linked.push(user);
    return this.writeLinkedUsersParsed(linked);
  }

  private async handleRemove(linkedUser: LinkedUser) {
    if (!this.app.minecraft.isBotOnline()) return;
    if (!this.app.discord.isClientOnline()) return;
    if (!this.app.discord.isGuildReady()) return this.app.discord.stateHandler.loadGuild();

    try {
      const member = await this.app.discord.guild.members.fetch(linkedUser.discordId);
      if (!member) return;
      if (this.app.config.verification.nickname.enabled && member.nickname) await member.setNickname(null);
      const verificationRoles = this.app.config.verification.roles;
      const roles = [verificationRoles.guildMember.roleId, ...verificationRoles.custom.flatMap((r) => r.roleId)];
      for (const role of roles) {
        if (member.roles.cache.has(role)) await member.roles.remove(role, "Updated Roles");
      }
    } catch (error) {
      console.error(`Failed to completely clean up roles for ${linkedUser.discordId}:`, error);
    }
  }

  removeLinkUserByUUID(uuid: string, update: boolean = true): LinkedUser[] {
    const linked = this.getLinkedUsers();
    const user = linked.find((user) => user.uuid === uuid);
    if (user && update) this.handleRemove(user);
    const updated = linked.filter((user) => user.uuid !== uuid);
    return this.writeLinkedUsersParsed(updated);
  }

  removeLinkUserByDiscordId(discordId: string, update: boolean = true): LinkedUser[] {
    const linked = this.getLinkedUsers();
    const user = linked.find((user) => user.discordId === discordId);
    if (user && update) this.handleRemove(user);
    const updated = linked.filter((user) => user.discordId !== discordId);
    return this.writeLinkedUsersParsed(updated);
  }

  removeLinkUser(user: LinkedUser, update: boolean = true): LinkedUser[] {
    if (update) this.handleRemove(user);
    const linked = this.getLinkedUsers();
    const updated = linked.filter((u) => u.uuid !== user.uuid && u.discordId !== user.discordId);
    return this.writeLinkedUsersParsed(updated);
  }

  async getPlayerVariableStats(
    uuid: string,
    hypixelGuild: Guild | null = null,
    player: Player | null = null,
    skyblock: SkyblockProfileWithMe | null = null
  ): Promise<Record<string, string | number>> {
    if (!this.app.minecraft.isBotOnline()) throw new HypixelDiscordChatBridgeError("Bot doesn't seem to be connected to Hypixel. Please try again.");
    const fetches = [];

    if (!hypixelGuild) {
      fetches.push(
        HypixelAPIReborn.getGuild("player", this.app.minecraft.bot.username).then((guild) => {
          if (guild === null) throw new HypixelDiscordChatBridgeError("In game Hypixel Guild not found.");
          if (guild.isRaw()) throw new HypixelDiscordChatBridgeError("In game Hypixel Guild not found.");
          hypixelGuild = guild;
          return guild;
        })
      );
    }
    if (!player) {
      fetches.push(
        HypixelAPIReborn.getPlayer(uuid).then((playerData) => {
          if (playerData.isRaw()) throw new HypixelDiscordChatBridgeError("Failed to fetch Player data.");
          player = playerData;
          return playerData;
        })
      );
    }
    if (!skyblock) fetches.push(getSelectedProfile(uuid).then((s) => (skyblock = s)));

    await Promise.all(fetches);
    if (!hypixelGuild) throw new HypixelDiscordChatBridgeError("In game Hypixel Guild not found.");
    if (!player) throw new HypixelDiscordChatBridgeError("Failed to fetch Player data");
    if (!skyblock) throw new HypixelDiscordChatBridgeError("Failed to fetch SkyBlock data");

    const networth = await getNetworthCalculator(skyblock).then((manager) => manager.getNetworth({ onlyNetworth: true }));
    const profile: SkyBlockMember = skyblock.me;
    const guildMember = hypixelGuild.members.find((m) => m.uuid === uuid);

    return {
      username: player.nickname,
      level: player.level.level,
      karma: player.karma,
      achievementPoints: player.achievements.points,
      guildRank: guildMember?.rank ?? "",
      guildName: hypixelGuild.name,

      bedwarsStar: player.stats.BedWars.level,
      bedwarsTokens: player.stats.BedWars.tokens,
      bedwarsKills: player.stats.BedWars.kills.total.kills,
      bedwarsDeaths: player.stats.BedWars.kills.total.deaths,
      bedwarsKDRatio: player.stats.BedWars.kills.total.ratio,
      bedwarsFinalKills: player.stats.BedWars.finals.total.kills,
      bedwarsFinalDeathss: player.stats.BedWars.finals.total.deaths,
      bedwarsFinalKDRatio: player.stats.BedWars.finals.total.ratio,
      bedwarsWins: player.stats.BedWars.wins,
      bedwarsLosses: player.stats.BedWars.losses,
      bedwarsWLRatio: player.stats.BedWars.winLossRatio,
      bedwarsBedsBroken: player.stats.BedWars.beds.broken,
      bedwarsBedsLost: player.stats.BedWars.beds.lost,
      bedwarsBedsBLRatio: player.stats.BedWars.beds.ratio,
      bedwarsPlayedGames: player.stats.BedWars.gamesPlayed,

      bedwarsSoloKills: player.stats.BedWars.eightOne.kills.total.kills,
      bedwarsSoloDeaths: player.stats.BedWars.eightOne.kills.total.deaths,
      bedwarsSoloKDRatio: player.stats.BedWars.eightOne.kills.total.ratio,
      bedwarsSoloFinalKills: player.stats.BedWars.eightOne.finals.total.kills,
      bedwarsSoloFinalDeathss: player.stats.BedWars.eightOne.finals.total.deaths,
      bedwarsSoloFinalKDRatio: player.stats.BedWars.eightOne.finals.total.ratio,
      bedwarsSoloWins: player.stats.BedWars.eightOne.wins,
      bedwarsSoloLosses: player.stats.BedWars.eightOne.losses,
      bedwarsSoloWLRatio: player.stats.BedWars.eightOne.winLossRatio,
      bedwarsSoloBedsBroken: player.stats.BedWars.eightOne.beds.broken,
      bedwarsSoloBedsLost: player.stats.BedWars.eightOne.beds.lost,
      bedwarsSoloBedsBLRatio: player.stats.BedWars.eightOne.beds.ratio,
      bedwarsSoloPlayedGames: player.stats.BedWars.eightOne.gamesPlayed,

      bedwarsDoublesKills: player.stats.BedWars.eightTwo.kills.total.kills,
      bedwarsDoublesDeaths: player.stats.BedWars.eightTwo.kills.total.deaths,
      bedwarsDoublesKDRatio: player.stats.BedWars.eightTwo.kills.total.ratio,
      bedwarsDoublesFinalKills: player.stats.BedWars.eightTwo.finals.total.kills,
      bedwarsDoublesFinalDeathss: player.stats.BedWars.eightTwo.finals.total.deaths,
      bedwarsDoublesFinalKDRatio: player.stats.BedWars.eightTwo.finals.total.ratio,
      bedwarsDoublesWins: player.stats.BedWars.eightTwo.wins,
      bedwarsDoublesLosses: player.stats.BedWars.eightTwo.losses,
      bedwarsDoublesWLRatio: player.stats.BedWars.eightTwo.winLossRatio,
      bedwarsDoublesBedsBroken: player.stats.BedWars.eightTwo.beds.broken,
      bedwarsDoublesBedsLost: player.stats.BedWars.eightTwo.beds.lost,
      bedwarsDoublesBedsBLRatio: player.stats.BedWars.eightTwo.beds.ratio,
      bedwarsDoublesPlayedGames: player.stats.BedWars.eightTwo.gamesPlayed,

      bedwarsThreesKills: player.stats.BedWars.fourThree.kills.total.kills,
      bedwarsThreesDeaths: player.stats.BedWars.fourThree.kills.total.deaths,
      bedwarsThreesKDRatio: player.stats.BedWars.fourThree.kills.total.ratio,
      bedwarsThreesFinalKills: player.stats.BedWars.fourThree.finals.total.kills,
      bedwarsThreesFinalDeathss: player.stats.BedWars.fourThree.finals.total.deaths,
      bedwarsThreesFinalKDRatio: player.stats.BedWars.fourThree.finals.total.ratio,
      bedwarsThreesWins: player.stats.BedWars.fourThree.wins,
      bedwarsThreesLosses: player.stats.BedWars.fourThree.losses,
      bedwarsThreesWLRatio: player.stats.BedWars.fourThree.winLossRatio,
      bedwarsThreesBedsBroken: player.stats.BedWars.fourThree.beds.broken,
      bedwarsThreesBedsLost: player.stats.BedWars.fourThree.beds.lost,
      bedwarsThreesBedsBLRatio: player.stats.BedWars.fourThree.beds.ratio,
      bedwarsThreesPlayedGames: player.stats.BedWars.fourThree.gamesPlayed,

      bedwarsFoursKills: player.stats.BedWars.fourFour.kills.total.kills,
      bedwarsFoursDeaths: player.stats.BedWars.fourFour.kills.total.deaths,
      bedwarsFoursKDRatio: player.stats.BedWars.fourFour.kills.total.ratio,
      bedwarsFoursFinalKills: player.stats.BedWars.fourFour.finals.total.kills,
      bedwarsFoursFinalDeathss: player.stats.BedWars.fourFour.finals.total.deaths,
      bedwarsFoursFinalKDRatio: player.stats.BedWars.fourFour.finals.total.ratio,
      bedwarsFoursWins: player.stats.BedWars.fourFour.wins,
      bedwarsFoursLosses: player.stats.BedWars.fourFour.losses,
      bedwarsFoursWLRatio: player.stats.BedWars.fourFour.winLossRatio,
      bedwarsFoursBedsBroken: player.stats.BedWars.fourFour.beds.broken,
      bedwarsFoursBedsLost: player.stats.BedWars.fourFour.beds.lost,
      bedwarsFoursBedsBLRatio: player.stats.BedWars.fourFour.beds.ratio,
      bedwarsFoursPlayedGames: player.stats.BedWars.fourFour.gamesPlayed,

      bedwars4v4Kills: player.stats.BedWars.twoFour.kills.total.kills,
      bedwars4v4Deaths: player.stats.BedWars.twoFour.kills.total.deaths,
      bedwars4v4KDRatio: player.stats.BedWars.twoFour.kills.total.ratio,
      bedwars4v4FinalKills: player.stats.BedWars.twoFour.finals.total.kills,
      bedwars4v4FinalDeathss: player.stats.BedWars.twoFour.finals.total.deaths,
      bedwars4v4FinalKDRatio: player.stats.BedWars.twoFour.finals.total.ratio,
      bedwars4v4Wins: player.stats.BedWars.twoFour.wins,
      bedwars4v4Losses: player.stats.BedWars.twoFour.losses,
      bedwars4v4WLRatio: player.stats.BedWars.twoFour.winLossRatio,
      bedwars4v4BedsBroken: player.stats.BedWars.twoFour.beds.broken,
      bedwars4v4BedsLost: player.stats.BedWars.twoFour.beds.lost,
      bedwars4v4BedsBLRatio: player.stats.BedWars.twoFour.beds.ratio,
      bedwars4v4PlayedGames: player.stats.BedWars.twoFour.gamesPlayed,

      skywarsStar: player.stats.SkyWars.level,
      skywarsCoins: player.stats.SkyWars.coins,
      skywarsTokens: player.stats.SkyWars.tokens,
      skywarsSouls: player.stats.SkyWars.souls,
      skywarsOpals: player.stats.SkyWars.opals,
      skywarsKills: player.stats.SkyWars.kills,
      skywarsDeaths: player.stats.SkyWars.deaths,
      skywarsKDRatio: player.stats.SkyWars.KDR,
      skywarsWins: player.stats.SkyWars.wins,
      skywarsLosses: player.stats.SkyWars.losses,
      skywarsWLRatio: player.stats.SkyWars.WLR,
      skywarsPlayedGames: player.stats.SkyWars.gamesPlayed,

      duelsDivision: player.stats.Duels.title ?? "",
      duelsKills: player.stats.Duels.kills,
      duelsDeaths: player.stats.Duels.deaths,
      duelsKDRatio: player.stats.Duels.KDR,
      duelsWins: player.stats.Duels.wins,
      duelsLosses: player.stats.Duels.losses,
      duelsWLRatio: player.stats.Duels.WLR,
      duelsPlayedGames: player.stats.Duels.playedGames,

      skyblockBank: networth.bank,
      skyblockPurse: networth.purse,
      skyblockLevel: profile.leveling.level,

      skyblockSkillsAverageLevel: profile.playerData.skills.average,
      skyblockSkillsNonCosmeticAverageLevel: profile.playerData.skills.nonCosmeticAverage,
      skyblockSkillsFarmingLevel: profile.playerData.skills.farming.level,
      skyblockSkillsMiningLevel: profile.playerData.skills.mining.level,
      skyblockSkillsCombatLevel: profile.playerData.skills.combat.level,
      skyblockSkillsForagingLevel: profile.playerData.skills.foraging.level,
      skyblockSkillsFishingLevel: profile.playerData.skills.fishing.level,
      skyblockSkillsEnchantingLevel: profile.playerData.skills.enchanting.level,
      skyblockSkillsAlchemyLevel: profile.playerData.skills.alchemy.level,
      skyblockSkillsCarpentryLevel: profile.playerData.skills.carpentry.level,
      skyblockSkillsRunecraftingLevel: profile.playerData.skills.runecrafting.level,
      skyblockSkillsSocialLevel: profile.playerData.skills.social.level,
      skyblockSkillsTamingLevel: profile.playerData.skills.taming.level,

      skyblockSkillsFarmingXp: profile.playerData.skills.farming.xp,
      skyblockSkillsMiningXp: profile.playerData.skills.mining.xp,
      skyblockSkillsCombatXp: profile.playerData.skills.combat.xp,
      skyblockSkillsForagingXp: profile.playerData.skills.foraging.xp,
      skyblockSkillsFishingXp: profile.playerData.skills.fishing.xp,
      skyblockSkillsEnchantingXp: profile.playerData.skills.enchanting.xp,
      skyblockSkillsAlchemyXp: profile.playerData.skills.alchemy.xp,
      skyblockSkillsCarpentryXp: profile.playerData.skills.carpentry.xp,
      skyblockSkillsRunecraftingXp: profile.playerData.skills.runecrafting.xp,
      skyblockSkillsSocialXp: profile.playerData.skills.social.xp,
      skyblockSkillsTamingXp: profile.playerData.skills.taming.xp,

      skyblockSlayerZombieLevel: profile.slayers.zombie.level.level,
      skyblockSlayerSpiderLevel: profile.slayers.spider.level.level,
      skyblockSlayerWolfLevel: profile.slayers.wolf.level.level,
      skyblockSlayerEndermanLevel: profile.slayers.enderman.level.level,
      skyblockSlayerBlazeLevel: profile.slayers.blaze.level.level,
      skyblockSlayerVampireLevel: profile.slayers.vampire.level.level,

      skyblockSlayerZombieXp: profile.slayers.zombie.level.xp,
      skyblockSlayerSpiderXp: profile.slayers.spider.level.xp,
      skyblockSlayerWolfXp: profile.slayers.wolf.level.xp,
      skyblockSlayerEndermanXp: profile.slayers.enderman.level.xp,
      skyblockSlayerBlazeXp: profile.slayers.blaze.level.xp,
      skyblockSlayerVampireXp: profile.slayers.vampire.level.xp,

      skyblockDungeonsSecrets: profile.dungeons.secrets,
      skyblockDungeonsXp: profile.dungeons.level.xp,
      skyblockDungeonsLevel: profile.dungeons.level.level,

      skyblockDungeonsClassAverageLevel: profile.dungeons.classes.average,
      skyblockDungeonsClassHealerLevel: profile.dungeons.classes.healer.level,
      skyblockDungeonsClassMageLevel: profile.dungeons.classes.mage.level,
      skyblockDungeonsClassBerserkLevel: profile.dungeons.classes.berserk.level,
      skyblockDungeonsClassArcherLevel: profile.dungeons.classes.archer.level,
      skyblockDungeonsClassTankLevel: profile.dungeons.classes.tank.level,

      skyblockDungeonsClassHealerXp: profile.dungeons.classes.healer.xp,
      skyblockDungeonsClassMageXp: profile.dungeons.classes.mage.xp,
      skyblockDungeonsClassBerserkXp: profile.dungeons.classes.berserk.xp,
      skyblockDungeonsClassArcherXp: profile.dungeons.classes.archer.xp,
      skyblockDungeonsClassTankXp: profile.dungeons.classes.tank.xp,

      skyblockDungeonsEssenceDiamond: profile.currencies.diamondEssence,
      skyblockDungeonsEssenceDragon: profile.currencies.dragonEssence,
      skyblockDungeonsEssenceSpider: profile.currencies.spiderEssence,
      skyblockDungeonsEssenceWither: profile.currencies.witherEssence,
      skyblockDungeonsEssenceUndead: profile.currencies.undeadEssence,
      skyblockDungeonsEssenceGold: profile.currencies.goldEssence,
      skyblockDungeonsEssenceIce: profile.currencies.iceEssence,
      skyblockDungeonsEssenceCrimson: profile.currencies.crimsonEssence,

      skyblockCrimsonIsleReputationBarbarian: profile.crimsonIsle.barbariansReputation,
      skyblockCrimsonIsleReputationMage: profile.crimsonIsle.magesReputation,

      skyblockCrimsonIsleKuudraBasic: profile.crimsonIsle.kuudra.basicCompletions,
      skyblockCrimsonIsleKuudraHot: profile.crimsonIsle.kuudra.hotCompletions,
      skyblockCrimsonIsleKuudraBurning: profile.crimsonIsle.kuudra.burningCompletions,
      skyblockCrimsonIsleKuudraFiery: profile.crimsonIsle.kuudra.fieryCompletions,
      skyblockCrimsonIsleKuudraInfernal: profile.crimsonIsle.kuudra.infernalCompletions,

      skyblockNetworth: networth.networth,
      skyblockNetwrothArmor: networth.types.armor.total,
      skyblockNetwrothEquipment: networth.types.equipment.total,
      skyblockNetwrothWardrobe: networth.types.wardrobe.total,
      skyblockNetwrothInventory: networth.types.inventory.total,
      skyblockNetwrothEnderchest: networth.types.enderchest.total,
      skyblockNetwrothAccessories: networth.types.accessories.total,
      skyblockNetwrothPersonalVault: networth.types.personal_vault.total,
      skyblockNetwrothFishingBag: networth.types.fishing_bag.total,
      skyblockNetwrothStorage: networth.types.storage.total,
      skyblockNetwrothMuseum: networth.types.museum.total,
      skyblockNetwrothSacks: networth.types.sacks.total,
      skyblockNetwrothEssence: networth.types.essence.total,
      skyblockNetwrothPets: networth.types.pets.total,

      skyblockNetworthNetworthUnsoulbound: networth.unsoulboundNetworth,
      skyblockNetwrothArmorUnsoulbound: networth.types.armor.unsoulboundTotal,
      skyblockNetwrothEquipmentUnsoulbound: networth.types.equipment.unsoulboundTotal,
      skyblockNetwrothWardrobeUnsoulbound: networth.types.wardrobe.unsoulboundTotal,
      skyblockNetwrothInventoryUnsoulbound: networth.types.inventory.unsoulboundTotal,
      skyblockNetwrothEnderchestUnsoulbound: networth.types.enderchest.unsoulboundTotal,
      skyblockNetwrothAccessoriesUnsoulbound: networth.types.accessories.unsoulboundTotal,
      skyblockNetwrothPersonalVaultUnsoulbound: networth.types.personal_vault.unsoulboundTotal,
      skyblockNetwrothFishingBagUnsoulbound: networth.types.fishing_bag.unsoulboundTotal,
      skyblockNetwrothStorageUnsoulbound: networth.types.storage.unsoulboundTotal,
      skyblockNetwrothMuseumUnsoulbound: networth.types.museum.unsoulboundTotal,
      skyblockNetwrothSacksUnsoulbound: networth.types.sacks.unsoulboundTotal,
      skyblockNetwrothEssenceUnsoulbound: networth.types.essence.unsoulboundTotal,
      skyblockNetwrothPetsUnsoulbound: networth.types.pets.unsoulboundTotal,

      skyblockChocolateFactoryLevel: profile.chocolateFactory.prestige,
      skyblockChocolateFactoryChocolateCurrent: profile.chocolateFactory.currentChocolate,
      skyblockChocolateFactoryChocolateSincePrestige: profile.chocolateFactory.chocolateSincePrestige,
      skyblockChocolateFactoryChocolateTotal: profile.chocolateFactory.totalChocolate,

      skyblockChocolateFactoryEmployeeBro: profile.chocolateFactory.employees.bro,
      skyblockChocolateFactoryEmployeeCousin: profile.chocolateFactory.employees.cousin,
      skyblockChocolateFactoryEmployeeSis: profile.chocolateFactory.employees.sis,
      skyblockChocolateFactoryEmployeeFather: profile.chocolateFactory.employees.father,
      skyblockChocolateFactoryEmployeeGrandma: profile.chocolateFactory.employees.grandma,
      skyblockChocolateFactoryEmployeeUncle: profile.chocolateFactory.employees.uncle,
      skyblockChocolateFactoryEmployeeDog: profile.chocolateFactory.employees.dog,

      skyblockJacobMedalsGold: profile.jacobContests.medals.gold,
      skyblockJacobMedalsSilver: profile.jacobContests.medals.silver,
      skyblockJacobMedalsBronze: profile.jacobContests.medals.bronze,

      skyblockJacobPerksLevelCap: profile.jacobContests.perks?.farmingLevelCap,
      skyblockJacobPerksDoubleDrops: profile.jacobContests.perks?.doubleDrops,

      skyblockJacobPersonalBestNetherWart: profile.jacobContests.personalBests.NETHER_STALK ?? 0,
      skyblockJacobPersonalBestCocoBeans: profile.jacobContests.personalBests["INK_SACK:3"] ?? 0,
      skyblockJacobPersonalBestMushroom: profile.jacobContests.personalBests?.MUSHROOM_COLLECTION ?? 0,
      skyblockJacobPersonalBestWheat: profile.jacobContests.personalBests?.WHEAT ?? 0,
      skyblockJacobPersonalBestPotato: profile.jacobContests.personalBests?.POTATO_ITEM ?? 0,
      skyblockJacobPersonalBestPumpkin: profile.jacobContests.personalBests?.PUMPKIN ?? 0,
      skyblockJacobPersonalBestCarrot: profile.jacobContests.personalBests?.CARROT_ITEM ?? 0,
      skyblockJacobPersonalBestCactus: profile.jacobContests.personalBests?.CACTUS ?? 0,
      skyblockJacobPersonalBestMelon: profile.jacobContests.personalBests?.MELON ?? 0,
      skyblockJacobPersonalBestSugarCane: profile.jacobContests.personalBests?.SUGAR_CANE ?? 0
    };
  }

  async updateLinkedUsersRolesByUUID(UUID: string): Promise<LinkedUser | null> {
    const linkedUser = this.getLinkedUserByUUID(UUID);
    if (linkedUser) return await this.updateLinkedUsersRoles(linkedUser);
    return null;
  }

  async updateLinkedUsersRolesByDiscordId(discordId: string): Promise<LinkedUser | null> {
    const linkedUser = this.getLinkedUserByDiscordId(discordId);
    if (linkedUser) return await this.updateLinkedUsersRoles(linkedUser);
    return null;
  }

  async updateLinkedUsersRoles(linkedUser: LinkedUser): Promise<LinkedUser | null> {
    if (!this.app.minecraft.isBotOnline()) throw new HypixelDiscordChatBridgeError("Bot doesn't seem to be connected to Hypixel. Please try again.");
    if (!this.app.discord.isClientOnline()) throw new HypixelDiscordChatBridgeError("The discord bot doesn't seam to be online? Please restart the application");
    if (!this.app.discord.isGuildReady()) {
      this.app.discord.stateHandler.loadGuild();
      throw new HypixelDiscordChatBridgeError("The discord server isn't ready. Please try again later");
    }

    const member = await this.app.discord.guild.members.fetch(linkedUser.discordId).catch((e) => {
      console.log(e);
      return null;
    });
    if (!member) {
      this.removeLinkUser(linkedUser);
      return null;
    }

    if (this.app.discord.guild.ownerId === member.user.id) {
      this.removeLinkUser(linkedUser);
      throw new HypixelDiscordChatBridgeError("This user owns the server thus the bot cannot update it");
    }

    const verificationRoles = this.app.config.verification.roles;
    const rolesToAdd: string[] = [];
    const rolesToRemove: string[] = [];

    if (verificationRoles.verified.enabled) rolesToAdd.push(verificationRoles.verified.roleId);
    const hypixelGuild = await HypixelAPIReborn.getGuild("player", this.app.minecraft.bot.username).then((guild) => {
      if (guild === null) throw new HypixelDiscordChatBridgeError("In game Hypixel Guild not found.");
      if (guild.isRaw()) throw new HypixelDiscordChatBridgeError("In game Hypixel Guild not found.");
      return guild;
    });

    const stats = await this.getPlayerVariableStats(linkedUser.uuid, hypixelGuild);
    const guildMember = hypixelGuild.members.find((m) => m.uuid === linkedUser.uuid);
    if (guildMember) {
      if (verificationRoles.guildMember.enabled) rolesToAdd.push(verificationRoles.guildMember.roleId);

      const guildRank = verificationRoles.custom.find((r) =>
        r.requirements
          .filter((req) => r.enabled !== false && req.type === "guildRank")
          .map((req) => req.value)
          .includes(guildMember.rank)
      );
      if (guildRank && guildRank.enabled !== false) rolesToAdd.push(guildRank.roleId);
    } else if (verificationRoles.guildMember.enabled) {
      rolesToRemove.push(verificationRoles.guildMember.roleId);
    }

    if (verificationRoles.custom.length > 0) {
      for (const role of verificationRoles.custom.filter((r) => r.requirements.some((req) => req.type !== "guildRank"))) {
        if (role.enabled === false) continue;
        const meetsRequirements = role.requirements.every((req) => req.value <= (stats[req.type] ?? 0));
        if (meetsRequirements) rolesToAdd.push(role.roleId);
      }
    }

    if (this.app.config.verification.nickname.enabled) {
      member.setNickname(
        ReplaceVariables(
          this.app.config.verification.nickname.nickname,
          Object.fromEntries(Object.entries(stats).map(([key, value]) => [key, typeof value === "number" ? FormatNumber(value) : value]))
        ).replace(/,/g, this.app.config.verification.nickname.removeCommas ? "" : ","),
        "Updated Roles"
      );
    }

    await member.roles.add(rolesToAdd, "Updated Roles");
    await member.roles.remove(
      [verificationRoles.guildMember.roleId, ...verificationRoles.custom.flatMap((r) => r.roleId), ...rolesToRemove].filter((role) => !rolesToAdd.includes(role)),
      "Updated Roles"
    );
    return linkedUser;
  }
}

export default LinkedManager;
