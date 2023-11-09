import { minecraft } from '../../../config.json';
import { Client } from 'hypixel-api-reborn';

export const hypixel = new Client(minecraft.API.hypixelAPIkey, {
  cache: true,
});
