const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { uploadImage } = require("../../contracts/API/imgurAPI.js");
const axios = require("axios");

class KittyCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "kitty";
    this.aliases = ["cat", "cutecat"];
    this.description = "Random image of cute cat.";
    this.options = [];
  }

  async onCommand(username, message) {
    try {
      const { data } = await axios.get(`https://api.thecatapi.com/v1/images/search`);

      if (data === undefined) {
        throw "An error occured while fetching the image. Please try again later.";
      }

      const link = data[0].url;
      const upload = await uploadImage(link);

      imgurUrl = upload.data.link;
      this.send("Cute Cat: Check Discord Bridge for image.");
    } catch (error) {
      this.send(`[ERROR] ${error ?? "Something went wrong.."}`);
    }
  }
}

module.exports = KittyCommand;
