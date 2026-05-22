import Command from '../Private/Command.js';
import CommandData from '../Private/CommandData.js';
import CommandDataOption from '../Private/CommandDataOption.js';
import HypixelDiscordChatBridgeError from '../../Private/Error.js';
import prettyMilliseconds from 'pretty-ms';
import { getSelectedProfile } from '../../Utils/HypixelUtils.js';
import type { MinecraftManagerWithBot, ParsedForgeSlot } from '../../Types/Minecraft.js';
import type { SkyBlockMemberMiningHotmForgeItem } from 'hypixel-api-reborn';

// CREDITS: by @Kathund (https://github.com/Kathund)
class ForgeCommand extends Command {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new CommandData()
      .setName('forge')
      .setDescription('Skyblock Forge Info Stats of specified user.')
      .setOptions([new CommandDataOption().setName('username').setDescription('Minecraft Username')]);
  }

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;
    const { username, profile } = await getSelectedProfile(player);
    const slots: ParsedForgeSlot[] = [];
    Object.values(profile.me.mining.hotm.forge)
      .filter((slot: SkyBlockMemberMiningHotmForgeItem | null) => slot !== null)
      .forEach((slot: SkyBlockMemberMiningHotmForgeItem) =>
        slots.push({ item: slot.name, slot: slot.slot, finished: Date.now() > slot.endTime, end: slot.endTime, timeLeft: prettyMilliseconds(Date.now() - slot.endTime) })
      );

    if (slots.length === 0) throw new HypixelDiscordChatBridgeError(`${username} has no items in their forge.`);
    this.send(`${username}'s Forge: ${slots.map((slot) => `${slot.slot}: ${slot.item} ${slot.finished ? 'Finished' : `(${slot.timeLeft})`}`).join(' | ')}`);
  }
}

export default ForgeCommand;
