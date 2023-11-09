import axios from 'axios';

const cache = new Map();

export const getUUID = async (username: any) => {
  try {
    if (cache.has(username)) {
      const data = cache.get(username);

      if (data.last_save + 43200000 > Date.now()) {
        return data.id;
      }
    }

    const { data } = await axios.get(`https://api.mojang.com/users/profiles/minecraft/${username}`);

    if (data.errorMessage || data.id === undefined) {
      throw data.errorMessage ?? 'Invalid username.';
    }

    cache.set(username, {
      last_save: Date.now(),
      id: data.id,
    });

    return data.id;
  } catch (error: any) {
    if (error.response.data.errorMessage !== undefined) {
      throw error.response.data.errorMessage === `Couldn't find any profile with name ${username}`
        ? 'Invalid username.'
        : error.response.data.errorMessage ===
          'getProfileName.name: Invalid profile name, getProfileName.name: size must be between 1 and 25'
        ? 'Invalid username.'
        : error.response.data.errorMessage;
    }

    // eslint-disable-next-line no-throw-literal
    throw 'Request to Mojang API failed. Please try again!';
  }
};

export const getUsername = async (uuid: any) => {
  try {
    const response = await axios.get(`https://playerdb.co/api/player/minecraft/${uuid}`);
    return response.data.data.player.username;
  } catch (error: any) {
    console.log(error);
  }
};

export const resolveUsernameOrUUID = async (username: any) => {
  try {
    const { data } = await axios.get(`https://playerdb.co/api/player/minecraft/${username}`);

    if (data.success === false || data.error === true) {
      throw data.message == 'Mojang API lookup failed.' ? 'Invalid username.' : data.message;
    }

    if (data.data?.player?.raw_id === undefined) {
      // eslint-disable-next-line no-throw-literal
      throw 'No UUID found for that username.';
    }

    return {
      username: data.data.player.username,
      uuid: data.data.player.raw_id,
    };
  } catch (error: any) {
    console.log(error);
  }
};
