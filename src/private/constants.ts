import type { Dev, Devs, MiscCredit } from "../types/misc.js";

export const CommonDevs: Record<Devs, Dev> = {
  DuckySoLucky: { username: "duckysolucky", id: "486155512568741900", iconURL: "https://imgur.com/tgwQJTX.png", type: "Maintainer" },
  Kathund: { username: ".kathund", github: "kathund", id: "1276524855445164098", iconURL: "https://i.imgur.com/uUuZx2E.png", type: "Maintainer" },
  GeorgeFilos: { username: "george_filos", github: "georgefilos", id: "177083022305263616", iconURL: "https://i.imgur.com/YdxW048.png", type: "Contributor" },
  Zickles: { username: "zickles", id: "468043261911498767", iconURL: "https://i.imgur.com/vw8SAq4.png", type: "Contributor" }
};

export const MiscCredits: MiscCredit[] = [
  { name: "discord.js", description: "Handles the discord part of this project", link: "discord.js.org" },
  { name: "mineflayer", description: "Handles the minecraft part of this project", link: "prismarinejs.github.io/mineflayer" },
  { name: "Hypixel API", description: "It's the Hypixel API? What else would I say", link: "api.hypixel.net" },
  { name: "Hypixel-API-Reborn", description: "Handles all processing of the Hypixel API", link: "github.com/Hypixel-API-Reborn/hypixel-api-reborn" },
  { name: "Mowojang API", description: "Handles UUID <--> Username conversions", link: "mowojang.matdoes.dev" },
  { name: "DawJaw", description: "Jacob contests tracking", link: "dawjaw.net" },
  { name: "Soopy", description: "SoopyV2 commands", link: "soopy.dev" }
];
