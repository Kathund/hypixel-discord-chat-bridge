import GenericManager from "../GenericManager.js";
import HypixelDiscordChatBridgeError from "../../private/error.js";
import LinkedUser from "./LinkedUser.js";
import MowojangAPI from "../../private/MowojangAPI.js";
import { getNetWorth, getPlayer, getSelectedProfile } from "../../utils/hypixelUtils.js";
import { readFile, writeFile } from "node:fs/promises";
import type DataManager from "../DataManager.js";
import type { Guild, Player, SkyblockProfileWithMe } from "hypixel-api-reborn";
import type { LinkedData, LinkedUserData, OldFormat } from "../../types/linked.js";

class LinkedManager extends GenericManager<LinkedUserData, LinkedData, LinkedUser> {
  constructor(data: DataManager) {
    super(data, "linked.json", "linked", []);
    this.checkData();
  }

  private isNewFormat(data: unknown): data is LinkedUserData[] {
    return (
      Array.isArray(data) &&
      data.every((item) => typeof item === "object" && item !== null && typeof (item as any).uuid === "string" && typeof (item as any).discordId === "string")
    );
  }

  private isOldFormat(data: unknown): data is OldFormat {
    return typeof data === "object" && data !== null && !Array.isArray(data) && Object.values(data).every((value) => typeof value === "string");
  }

  private convertOldFormat(data: OldFormat): LinkedUserData[] {
    const seenDiscordIds = new Set<string>();
    const result: LinkedUserData[] = [];

    for (const [uuid, discordId] of Object.entries(data)) {
      if (seenDiscordIds.has(discordId)) continue;
      seenDiscordIds.add(discordId);
      result.push({ uuid, discordId });
    }

    return result;
  }

  private async checkData(): Promise<LinkedUserData[]> {
    const file = await readFile("data/linked.json");
    const data = JSON.parse(file.toString());
    if (this.isNewFormat(data)) return data;

    if (this.isOldFormat(data)) {
      const converted = this.convertOldFormat(data);
      await writeFile("data/linked.json", JSON.stringify(converted, null, 2), "utf-8");
      return converted;
    }

    throw new Error("data/linked.json is not a recognized format.");
  }

  override parseData(data: LinkedData): LinkedUser[] {
    return data.map((user) => new LinkedUser(user, this));
  }

  async writeUsersParsed(users: LinkedUser[]): Promise<LinkedUser[]> {
    return await this.writeData(users.map((user) => user.toJSON()));
  }

  async getUserByDiscordId(discordId: string): Promise<LinkedUser | undefined> {
    const users = await this.getFullData();
    return users.find((user) => user.discordId === discordId);
  }

  async getUserByUsername(username: string): Promise<LinkedUser | undefined> {
    const UUID = await MowojangAPI.getUUID(username);
    if (UUID === null) throw new HypixelDiscordChatBridgeError("User doesn't exist");
    return this.getUserByUUID(UUID);
  }

  async getUserByUUID(UUID: string): Promise<LinkedUser | undefined> {
    const users = await this.getFullData();
    return users.find((user) => user.uuid === UUID);
  }

  async getPlayerVariableStats(
    uuid: string,
    hypixelGuild: Guild | null = null,
    player: Player | null = null,
    skyblock: SkyblockProfileWithMe | null = null
  ): Promise<Record<string, string | number>> {
    if (!this.data.application.minecraft.isBotOnline()) throw new HypixelDiscordChatBridgeError(this.data.application.messages.minecraftBotOffline);
    const fetches = [];

    if (!hypixelGuild) fetches.push(this.data.application.getBotGuild().then((guild) => (hypixelGuild = guild)));
    if (!player) fetches.push(getPlayer(uuid).then((playerData) => (player = playerData)));
    if (!skyblock) {
      fetches.push(
        getSelectedProfile(uuid)
          .then((s) => (skyblock = s.profile))
          .catch(() => (skyblock = null))
      );
    }

    await Promise.all(fetches);
    if (!hypixelGuild) throw new HypixelDiscordChatBridgeError("In game Hypixel Guild not found.");
    if (!player) throw new HypixelDiscordChatBridgeError("Failed to fetch Player data");

    const networth = skyblock ? await getNetWorth(skyblock).catch(() => null) : null;
    const profile = skyblock?.me;
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
      skywarsKills: player.stats.SkyWars.kills.total.kills,
      skywarsDeaths: player.stats.SkyWars.deaths.total.deaths,
      skywarsKDRatio: player.stats.SkyWars.kills.total.ratio,
      skywarsWins: player.stats.SkyWars.wins,
      skywarsLosses: player.stats.SkyWars.losses,
      skywarsWLRatio: player.stats.SkyWars.WLRatio,
      skywarsPlayedGames: player.stats.SkyWars.gamesPlayed,

      duelsDivision: player.stats.Duels.title ?? "",
      duelsKills: player.stats.Duels.kills,
      duelsDeaths: player.stats.Duels.deaths,
      duelsKDRatio: player.stats.Duels.KDR,
      duelsWins: player.stats.Duels.wins,
      duelsLosses: player.stats.Duels.losses,
      duelsWLRatio: player.stats.Duels.WLR,
      duelsPlayedGames: player.stats.Duels.playedGames,

      skyblockBank: networth?.bank ?? 0,
      skyblockPurse: networth?.purse ?? 0,
      skyblockLevel: profile?.leveling?.level ?? 0,

      skyblockSkillsAverageLevel: profile?.playerData?.skills?.average ?? 0,
      skyblockSkillsNonCosmeticAverageLevel: profile?.playerData?.skills?.nonCosmeticAverage ?? 0,
      skyblockSkillsFarmingLevel: profile?.playerData?.skills?.farming?.level ?? 0,
      skyblockSkillsMiningLevel: profile?.playerData?.skills?.mining?.level ?? 0,
      skyblockSkillsCombatLevel: profile?.playerData?.skills?.combat?.level ?? 0,
      skyblockSkillsForagingLevel: profile?.playerData?.skills?.foraging?.level ?? 0,
      skyblockSkillsFishingLevel: profile?.playerData?.skills?.fishing?.level ?? 0,
      skyblockSkillsEnchantingLevel: profile?.playerData?.skills?.enchanting?.level ?? 0,
      skyblockSkillsAlchemyLevel: profile?.playerData?.skills?.alchemy?.level ?? 0,
      skyblockSkillsCarpentryLevel: profile?.playerData?.skills?.carpentry?.level ?? 0,
      skyblockSkillsRunecraftingLevel: profile?.playerData?.skills?.runecrafting?.level ?? 0,
      skyblockSkillsSocialLevel: profile?.playerData?.skills?.social?.level ?? 0,
      skyblockSkillsTamingLevel: profile?.playerData?.skills?.taming?.level ?? 0,

      skyblockSkillsFarmingXp: profile?.playerData?.skills?.farming?.xp ?? 0,
      skyblockSkillsMiningXp: profile?.playerData?.skills?.mining?.xp ?? 0,
      skyblockSkillsCombatXp: profile?.playerData?.skills?.combat?.xp ?? 0,
      skyblockSkillsForagingXp: profile?.playerData?.skills?.foraging?.xp ?? 0,
      skyblockSkillsFishingXp: profile?.playerData?.skills?.fishing?.xp ?? 0,
      skyblockSkillsEnchantingXp: profile?.playerData?.skills?.enchanting?.xp ?? 0,
      skyblockSkillsAlchemyXp: profile?.playerData?.skills?.alchemy?.xp ?? 0,
      skyblockSkillsCarpentryXp: profile?.playerData?.skills?.carpentry?.xp ?? 0,
      skyblockSkillsRunecraftingXp: profile?.playerData?.skills?.runecrafting?.xp ?? 0,
      skyblockSkillsSocialXp: profile?.playerData?.skills?.social?.xp ?? 0,
      skyblockSkillsTamingXp: profile?.playerData?.skills?.taming?.xp ?? 0,

      skyblockSlayerZombieLevel: profile?.slayers?.zombie?.level?.level ?? 0,
      skyblockSlayerSpiderLevel: profile?.slayers?.spider?.level?.level ?? 0,
      skyblockSlayerWolfLevel: profile?.slayers?.wolf?.level?.level ?? 0,
      skyblockSlayerEndermanLevel: profile?.slayers?.enderman?.level?.level ?? 0,
      skyblockSlayerBlazeLevel: profile?.slayers?.blaze?.level?.level ?? 0,
      skyblockSlayerVampireLevel: profile?.slayers?.vampire?.level?.level ?? 0,

      skyblockSlayerZombieXp: profile?.slayers?.zombie?.level?.xp ?? 0,
      skyblockSlayerSpiderXp: profile?.slayers?.spider?.level?.xp ?? 0,
      skyblockSlayerWolfXp: profile?.slayers?.wolf?.level?.xp ?? 0,
      skyblockSlayerEndermanXp: profile?.slayers?.enderman?.level?.xp ?? 0,
      skyblockSlayerBlazeXp: profile?.slayers?.blaze?.level?.xp ?? 0,
      skyblockSlayerVampireXp: profile?.slayers?.vampire?.level?.xp ?? 0,

      skyblockDungeonsSecrets: profile?.dungeons?.secrets ?? 0,
      skyblockDungeonsXp: profile?.dungeons?.level?.xp ?? 0,
      skyblockDungeonsLevel: profile?.dungeons?.level?.level ?? 0,

      skyblockDungeonsClassAverageLevel: profile?.dungeons?.classes?.average ?? 0,
      skyblockDungeonsClassHealerLevel: profile?.dungeons?.classes?.healer?.level ?? 0,
      skyblockDungeonsClassMageLevel: profile?.dungeons?.classes?.mage?.level ?? 0,
      skyblockDungeonsClassBerserkLevel: profile?.dungeons?.classes?.berserk?.level ?? 0,
      skyblockDungeonsClassArcherLevel: profile?.dungeons?.classes?.archer?.level ?? 0,
      skyblockDungeonsClassTankLevel: profile?.dungeons?.classes?.tank?.level ?? 0,

      skyblockDungeonsClassHealerXp: profile?.dungeons?.classes?.healer?.xp ?? 0,
      skyblockDungeonsClassMageXp: profile?.dungeons?.classes?.mage?.xp ?? 0,
      skyblockDungeonsClassBerserkXp: profile?.dungeons?.classes?.berserk?.xp ?? 0,
      skyblockDungeonsClassArcherXp: profile?.dungeons?.classes?.archer?.xp ?? 0,
      skyblockDungeonsClassTankXp: profile?.dungeons?.classes?.tank?.xp ?? 0,

      skyblockDungeonsEssenceDiamond: profile?.currencies?.diamondEssence ?? 0,
      skyblockDungeonsEssenceDragon: profile?.currencies?.dragonEssence ?? 0,
      skyblockDungeonsEssenceSpider: profile?.currencies?.spiderEssence ?? 0,
      skyblockDungeonsEssenceWither: profile?.currencies?.witherEssence ?? 0,
      skyblockDungeonsEssenceUndead: profile?.currencies?.undeadEssence ?? 0,
      skyblockDungeonsEssenceGold: profile?.currencies?.goldEssence ?? 0,
      skyblockDungeonsEssenceIce: profile?.currencies?.iceEssence ?? 0,
      skyblockDungeonsEssenceCrimson: profile?.currencies?.crimsonEssence ?? 0,

      skyblockCrimsonIsleReputationBarbarian: profile?.crimsonIsle?.barbariansReputation ?? 0,
      skyblockCrimsonIsleReputationMage: profile?.crimsonIsle?.magesReputation ?? 0,

      skyblockCrimsonIsleKuudraBasic: profile?.crimsonIsle?.kuudra?.basicCompletions ?? 0,
      skyblockCrimsonIsleKuudraHot: profile?.crimsonIsle?.kuudra?.hotCompletions ?? 0,
      skyblockCrimsonIsleKuudraBurning: profile?.crimsonIsle?.kuudra?.burningCompletions ?? 0,
      skyblockCrimsonIsleKuudraFiery: profile?.crimsonIsle?.kuudra?.fieryCompletions ?? 0,
      skyblockCrimsonIsleKuudraInfernal: profile?.crimsonIsle?.kuudra?.infernalCompletions ?? 0,

      skyblockNetworth: networth?.networth ?? 0,
      skyblockNetwrothArmor: networth?.types?.armor?.total ?? 0,
      skyblockNetwrothEquipment: networth?.types?.equipment?.total ?? 0,
      skyblockNetwrothWardrobe: networth?.types?.wardrobe?.total ?? 0,
      skyblockNetwrothInventory: networth?.types?.inventory?.total ?? 0,
      skyblockNetwrothEnderchest: networth?.types?.enderchest?.total ?? 0,
      skyblockNetwrothAccessories: networth?.types?.accessories?.total ?? 0,
      skyblockNetwrothPersonalVault: networth?.types?.personal_vault?.total ?? 0,
      skyblockNetwrothFishingBag: networth?.types?.fishing_bag?.total ?? 0,
      skyblockNetwrothStorage: networth?.types?.storage?.total ?? 0,
      skyblockNetwrothMuseum: networth?.types?.museum?.total ?? 0,
      skyblockNetwrothSacks: networth?.types?.sacks?.total ?? 0,
      skyblockNetwrothEssence: networth?.types?.essence?.total ?? 0,
      skyblockNetwrothPets: networth?.types?.pets?.total ?? 0,

      skyblockNetworthNetworthUnsoulbound: networth?.unsoulboundNetworth ?? 0,
      skyblockNetwrothArmorUnsoulbound: networth?.types?.armor?.unsoulboundTotal ?? 0,
      skyblockNetwrothEquipmentUnsoulbound: networth?.types?.equipment?.unsoulboundTotal ?? 0,
      skyblockNetwrothWardrobeUnsoulbound: networth?.types?.wardrobe?.unsoulboundTotal ?? 0,
      skyblockNetwrothInventoryUnsoulbound: networth?.types?.inventory?.unsoulboundTotal ?? 0,
      skyblockNetwrothEnderchestUnsoulbound: networth?.types?.enderchest?.unsoulboundTotal ?? 0,
      skyblockNetwrothAccessoriesUnsoulbound: networth?.types?.accessories?.unsoulboundTotal ?? 0,
      skyblockNetwrothPersonalVaultUnsoulbound: networth?.types?.personal_vault?.unsoulboundTotal ?? 0,
      skyblockNetwrothFishingBagUnsoulbound: networth?.types?.fishing_bag?.unsoulboundTotal ?? 0,
      skyblockNetwrothStorageUnsoulbound: networth?.types?.storage?.unsoulboundTotal ?? 0,
      skyblockNetwrothMuseumUnsoulbound: networth?.types?.museum?.unsoulboundTotal ?? 0,
      skyblockNetwrothSacksUnsoulbound: networth?.types?.sacks?.unsoulboundTotal ?? 0,
      skyblockNetwrothEssenceUnsoulbound: networth?.types?.essence?.unsoulboundTotal ?? 0,
      skyblockNetwrothPetsUnsoulbound: networth?.types?.pets?.unsoulboundTotal ?? 0,

      skyblockChocolateFactoryLevel: profile?.chocolateFactory?.prestige ?? 0,
      skyblockChocolateFactoryChocolateCurrent: profile?.chocolateFactory?.currentChocolate ?? 0,
      skyblockChocolateFactoryChocolateSincePrestige: profile?.chocolateFactory?.chocolateSincePrestige ?? 0,
      skyblockChocolateFactoryChocolateTotal: profile?.chocolateFactory?.totalChocolate ?? 0,

      skyblockChocolateFactoryEmployeeBro: profile?.chocolateFactory?.employees?.bro ?? 0,
      skyblockChocolateFactoryEmployeeCousin: profile?.chocolateFactory?.employees?.cousin ?? 0,
      skyblockChocolateFactoryEmployeeSis: profile?.chocolateFactory?.employees?.sis ?? 0,
      skyblockChocolateFactoryEmployeeFather: profile?.chocolateFactory?.employees?.father ?? 0,
      skyblockChocolateFactoryEmployeeGrandma: profile?.chocolateFactory?.employees?.grandma ?? 0,
      skyblockChocolateFactoryEmployeeUncle: profile?.chocolateFactory?.employees?.uncle ?? 0,
      skyblockChocolateFactoryEmployeeDog: profile?.chocolateFactory?.employees?.dog ?? 0,

      skyblockJacobMedalsGold: profile?.jacobContests?.medals?.gold ?? 0,
      skyblockJacobMedalsSilver: profile?.jacobContests?.medals?.silver ?? 0,
      skyblockJacobMedalsBronze: profile?.jacobContests?.medals?.bronze ?? 0,

      skyblockJacobPerksLevelCap: profile?.jacobContests?.perks?.farmingLevelCap ?? 0,
      skyblockJacobPerksDoubleDrops: profile?.jacobContests?.perks?.doubleDrops ?? 0,

      skyblockJacobPersonalBestNetherWart: profile?.jacobContests?.personalBests?.NETHER_STALK ?? 0,
      skyblockJacobPersonalBestCocoBeans: profile?.jacobContests?.personalBests["INK_SACK:3"] ?? 0,
      skyblockJacobPersonalBestMushroom: profile?.jacobContests?.personalBests?.MUSHROOM_COLLECTION ?? 0,
      skyblockJacobPersonalBestWheat: profile?.jacobContests?.personalBests?.WHEAT ?? 0,
      skyblockJacobPersonalBestPotato: profile?.jacobContests?.personalBests?.POTATO_ITEM ?? 0,
      skyblockJacobPersonalBestPumpkin: profile?.jacobContests?.personalBests?.PUMPKIN ?? 0,
      skyblockJacobPersonalBestCarrot: profile?.jacobContests?.personalBests?.CARROT_ITEM ?? 0,
      skyblockJacobPersonalBestCactus: profile?.jacobContests?.personalBests?.CACTUS ?? 0,
      skyblockJacobPersonalBestMelon: profile?.jacobContests?.personalBests?.MELON ?? 0,
      skyblockJacobPersonalBestSugarCane: profile?.jacobContests?.personalBests?.SUGAR_CANE ?? 0
    };
  }
}

export default LinkedManager;
