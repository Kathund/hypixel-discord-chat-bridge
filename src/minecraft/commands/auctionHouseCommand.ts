import { addCommas, timeSince } from '../../contracts/helperFunctions';
import { minecraftCommand } from '../../contracts/minecraftCommand';
import { minecraft as minecraftConfig } from '../../../config.json';
import { uploadImage } from '../../contracts/API/imgurAPI';
import { getUUID } from '../../contracts/API/PlayerDBAPI';
import { renderLore } from '../../contracts/renderItem';
import { getRank } from '../../../API/stats/rank';
import axios from 'axios';

export class AuctionHouseCommand extends minecraftCommand {
  name: string;
  aliases: string[];
  description: string;
  options: { name: string; description: string; required: boolean }[];
  constructor(minecraft: any) {
    super(minecraft);

    this.name = 'auction';
    this.aliases = ['ah', 'auctions'];
    this.description = 'Listed Auctions of specified user.';
    this.options = [
      {
        name: 'username',
        description: 'Minecraft username',
        required: false,
      },
    ];
  }

  async onCommand(username: any, message: any) {
    try {
      username = this.getArgs(message)[0] || username;

      let string = '';

      const uuid = await getUUID(username);

      const { hypixelAPIkey } = minecraftConfig.API;
      const [auctionResponse, playerResponse] = await Promise.all([
        axios.get(`https://api.hypixel.net/skyblock/auction?key=${hypixelAPIkey}&player=${uuid}`),
        axios.get(`https://api.hypixel.net/player?key=${hypixelAPIkey}&uuid=${uuid}`),
      ]);

      const auctions = auctionResponse.data?.auctions || [];
      const player = playerResponse.data?.player || {};

      if (auctions.length === 0) {
        return this.send(`/gc This player has no active auctions.`);
      }

      const activeAuctions = auctions.filter((auction: { end: number }) => auction.end >= Date.now());

      for (const auction of activeAuctions) {
        const lore = auction.item_lore.split('\n');

        lore.push('§8§m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯', `§7Seller: ${getRank(player)} ${player.displayname}`);

        if (auction.bin === undefined) {
          if (auction.bids.length === 0) {
            lore.push(`§7Starting Bid: §6${addCommas(auction.starting_bid)} coins`, `§7`);
          } else if (auction.bids.length > 0) {
            const bidderUUID = auction.bids[auction.bids.length - 1].bidder;

            const bidderResponse = await axios.get(
              `https://api.hypixel.net/player?key=${hypixelAPIkey}&uuid=${bidderUUID}`
            );

            const bidder = bidderResponse.data?.player || {};
            if (bidder === undefined) {
              // eslint-disable-next-line no-throw-literal
              throw `Failed to get bidder for auction ${auction.uuid}`;
            }

            const { amount } = auction.bids[auction.bids.length - 1];
            const bidOrBids = auction.bids.length === 1 ? 'bids' : 'bid';

            lore.push(
              `§7Bids: §a${auction.bids.length} ${bidOrBids}`,
              `§7`,
              `§7Top Bid: §6${amount.toLocaleString()} coins`,
              `§7Bidder: ${getRank(bidder)} ${bidder.displayname}`,
              `§7`
            );
          }
        } else {
          lore.push(`§7Buy it now: §6${auction.starting_bid.toLocaleString()} coins`, `§7`);
        }

        lore.push(`§7Ends in: §e${timeSince(auction.end)}`, `§7`, `§eClick to inspect`);

        const renderedItem = await renderLore(` ${auction.item_name}`, lore);
        const upload = await uploadImage(renderedItem);

        string += string === '' ? upload.data.link : ' | ' + upload.data.link;
      }

      this.send(`/gc ${`${username}'s Active Auctions: ${string}`}`);
    } catch (error) {
      console.log(error);
      this.send(`/gc [ERROR] ${error}`);
    }
  }
}
