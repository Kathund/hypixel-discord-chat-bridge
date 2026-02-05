import MinecraftCommand from "../../contracts/MinecraftCommand.js";
import { uploadImage } from "../../contracts/API/imgurAPI.js";
import axios from "axios";

class KittyCommand extends MinecraftCommand {
  /** @param {import("minecraft-protocol").Client} minecraft */
  constructor(minecraft) {
    super(minecraft);

    this.name = "kitty";
    this.aliases = ["cat", "cutecat"];
    this.description = "Random image of cute cat.";
    this.options = [];
  }

  /**
   * @param {string} player
   * @param {string} message
   * */
  async onCommand(player, message) {
    try {
      const { data } = await axios.get(`https://api.thecatapi.com/v1/images/search`);
      if (data === undefined) {
        throw "An error occured while fetching the image. Please try again later.";
      }

      if (data[0].url === undefined) {
        throw "An error occured while fetching the image. Please try again later.";
      }

      const buffer = await axios.get(data[0].url, { responseType: "arraybuffer" });
      await uploadImage(buffer.data);

      this.send("Cat image uploaded to Discord channel.");
    } catch (error) {
      this.send(`[ERROR] ${error ?? "Something went wrong.."}`);
    }
  }
}

export default KittyCommand;
