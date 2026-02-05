import { Client } from "hypixel-api-reborn";
import config from "../../../config.json" with { type: "json" };

const HypixelAPI = new Client(config.minecraft.API.hypixelAPIkey, {
  cache: true
});

export default HypixelAPI;
