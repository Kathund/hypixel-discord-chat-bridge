import Command from "../Private/Command.js";
import CommandData from "../Private/CommandData.js";
import CommandDataOption from "../Private/CommandDataOption.js";
import { FormatNumber } from "../../Utils/StringUtils.js";
import { getNetWorthCalculator, getSelectedProfile } from "../../Utils/HypixelUtils.js";
import type { MinecraftManagerWithBot } from "../../Types/Minecraft.js";

class NetworthCommand extends Command {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new CommandData()
      .setName("networth")
      .setAliases(["nw"])
      .setOptions([new CommandDataOption().setName("username").setRequired(true)]);
  }

  override async execute(player: string, message: string) {
    const args = this.getArgs(message);
    player = args[0] || player;

    const { username, profile } = await getSelectedProfile(player);
    const networthCalculator = await getNetWorthCalculator(profile);

    const networthData = await networthCalculator.getNetworth({ onlyNetworth: true });
    const nonCosmeticNetworthData = await networthCalculator.getNonCosmeticNetworth({ onlyNetworth: true });

    const networth = FormatNumber(networthData.networth);
    const unsoulboundNetworth = FormatNumber(networthData.unsoulboundNetworth);
    const nonCosmeticNetworth = FormatNumber(nonCosmeticNetworthData.networth);
    const nonCosmeticUnsoulboundNetworth = FormatNumber(nonCosmeticNetworthData.unsoulboundNetworth);

    const purse = FormatNumber(networthData.purse);
    const bank = profile.banking.balance !== 0 ? FormatNumber(profile.banking.balance) : "N/A";
    const personalBank = profile.me.profileStats.bankAccount !== 0 ? FormatNumber(profile.me.profileStats.bankAccount) : "N/A";
    const museumData = FormatNumber(networthData.types.museum?.total ?? 0);

    this.send(
      `${username}'s Networth is ${networth} | Non-Cosmetic Networth: ${nonCosmeticNetworth} | Unsoulbound Networth: ${
        unsoulboundNetworth
      } | Non-Cosmetic Unsoulbound Networth: ${nonCosmeticUnsoulboundNetworth} | Purse: ${purse} | Bank: ${bank} + ${personalBank} | Museum: ${museumData}`
    );
  }
}

export default NetworthCommand;
