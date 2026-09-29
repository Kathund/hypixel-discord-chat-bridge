import MinecraftCommand from "../private/commands/MinecraftCommand.ts";
import MinecraftCommandData from "../private/commands/MinecraftCommandData.ts";
import MinecraftCommandDataOption from "../private/commands/MinecraftCommandDataOption.ts";
import { formatNumber } from "../../utils/stringUtils.ts";
import { getNetWorthCalculator } from "../../utils/hypixelUtils.ts";

class NetworthCommand extends MinecraftCommand {
  override readonly data = new MinecraftCommandData()
    .setName("networth")
    .setDescription("Networth of specified user.")
    .setAliases(["nw"])
    .setOptions([new MinecraftCommandDataOption().setName("username").setRequired(true)]);

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const { calculator: networthCalculator, profile: profileData } = await getNetWorthCalculator(player);
    const { username, profile } = profileData;

    const networthData = await networthCalculator.getNetworth({ onlyNetworth: true });
    const nonCosmeticNetworthData = await networthCalculator.getNonCosmeticNetworth({ onlyNetworth: true });

    const networth = formatNumber(networthData.networth);
    const unsoulboundNetworth = formatNumber(networthData.unsoulboundNetworth);
    const nonCosmeticNetworth = formatNumber(nonCosmeticNetworthData.networth);
    const nonCosmeticUnsoulboundNetworth = formatNumber(nonCosmeticNetworthData.unsoulboundNetworth);

    const purse = formatNumber(networthData.purse);
    const bank = profile.banking.balance !== 0 ? formatNumber(profile.banking.balance) : "N/A";
    const personalBank = profile.me.profileStats.bankAccount !== 0 ? formatNumber(profile.me.profileStats.bankAccount) : "N/A";
    const museumData = formatNumber(networthData.types.museum?.total ?? 0);

    await this.send(
      `${username}'s Networth is ${networth} | Non-Cosmetic Networth: ${nonCosmeticNetworth} | Unsoulbound Networth: ${
        unsoulboundNetworth
      } | Non-Cosmetic Unsoulbound Networth: ${nonCosmeticUnsoulboundNetworth} | Purse: ${purse} | Bank: ${bank} + ${personalBank} | Museum: ${museumData}`
    );
  }
}

export default NetworthCommand;
