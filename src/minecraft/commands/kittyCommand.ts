import { minecraftCommand } from '../../contracts/minecraftCommand';
import { uploadImage } from '../../contracts/API/imgurAPI';
import axios from 'axios';

export default class KittyCommand extends minecraftCommand {
  name: string;
  aliases: string[];
  description: string;
  options: never[];
  constructor(minecraft: any) {
    super(minecraft);

    this.name = 'kitty';
    this.aliases = ['cat', 'cutecat'];
    this.description = 'Random image of cute cat.';
    this.options = [];
  }

  async onCommand(username: any, message: any) {
    try {
      const { data } = await axios.get(`https://api.thecatapi.com/v1/images/search`);

      if (data === undefined) {
        // eslint-disable-next-line no-throw-literal
        throw 'An error occurred while fetching the image. Please try again later.';
      }

      const link = data[0].url;
      const upload = await uploadImage(link);

      this.send(`/gc Cute Cat: ${upload.data.link}`);
    } catch (error) {
      this.send(`/gc [ERROR] ${error ?? 'Something went wrong..'}`);
    }
  }
}
