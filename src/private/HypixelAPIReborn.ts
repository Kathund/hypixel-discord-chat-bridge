import config from "../../config.json" with { type: "json" };
import { Client } from "hypixel-api-reborn";

const HypixelAPIReborn = new Client(config.API.hypixel.key, { cache: true });
HypixelAPIReborn.requestHandler.setBaseURL(config.API.hypixel.baseURL || undefined);
export default HypixelAPIReborn;
