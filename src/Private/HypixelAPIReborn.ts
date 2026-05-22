import config from '../../config.json' with { type: 'json' };
import { Client } from 'hypixel-api-reborn';

const HypixelAPIReborn = new Client(config.minecraft.API.hypixelAPIkey, { cache: true });
HypixelAPIReborn.requestHandler.setBaseURL('http://localhost:5555/hypixel');
export default HypixelAPIReborn;
