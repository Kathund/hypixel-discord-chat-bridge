/* eslint-disable no-throw-literal */
import { getUUID } from '../../src/contracts/API/PlayerDBAPI.js';
import { minecraft } from '../../config.json';
import { getMuseum } from './getMuseum.js';
import { isUuid } from '../utils/uuid.js';
import { get } from 'axios';

const cache = new Map();

export const getLatestProfile = async (uuid, options = { museum: false }) => {
  if (!isUuid(uuid)) {
    uuid = await getUUID(uuid).catch((error) => {
      throw error;
    });
  }

  if (cache.has(uuid)) {
    const data = cache.get(uuid);

    if (data.last_save + 300000 > Date.now()) {
      return data;
    }
  }

  const [{ data: playerRes }, { data: profileRes }] = await Promise.all([
    get(`https://api.hypixel.net/player?key=${minecraft.API.hypixelAPIkey}&uuid=${uuid}`),
    get(`https://api.hypixel.net/skyblock/profiles?key=${minecraft.API.hypixelAPIkey}&uuid=${uuid}`),
  ]).catch((error) => {
    throw error?.response?.data?.cause ?? 'Request to Hypixel API failed. Please try again!';
  });

  if (playerRes.success === false || profileRes.success === false) {
    throw 'Request to Hypixel API failed. Please try again!';
  }

  if (playerRes.player == null) {
    throw 'Player not found. It looks like this player has never joined the Hypixel.';
  }

  if (profileRes.profiles == null || profileRes.profiles.length == 0) {
    throw 'Player has no SkyBlock profiles.';
  }

  const profileData = profileRes.profiles.find((a) => a.selected) || null;
  if (profileData == null) {
    throw 'Player does not have selected profile.';
  }

  const profile = profileData.members[uuid];
  if (profile === null) {
    throw 'Uh oh, this player is not in this Skyblock profile.';
  }

  const output = {
    last_save: Date.now(),
    profiles: profileRes.profiles,
    profile: profile,
    profileData: profileData,
    playerRes: playerRes.player,
    uuid: uuid,
    ...(options.museum ? await getMuseum(profileData.profile_id, uuid) : {}),
  };

  cache.set(uuid, output);

  return output;
};
