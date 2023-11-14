import { minecraft } from '../../../config.json';
import { ImgurClient } from 'imgur';

const imgurClient = new ImgurClient({
  clientId: minecraft.API.imgurAPIkey,
});

export const uploadImage = async (image: string | Buffer | undefined) => {
  if (image === undefined) {
    // eslint-disable-next-line no-throw-literal
    throw 'An error occurred while uploading the image. Please try again later.';
  }

  const response = await imgurClient.upload({
    image: image,
    type: 'stream',
  });

  if (response.success === false) {
    // eslint-disable-next-line no-throw-literal
    throw 'An error occurred while uploading the image. Please try again later.';
  }

  return response;
};
