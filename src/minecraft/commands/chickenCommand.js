const { uploadImage } = require("../../contracts/API/imgurAPI.js");
const minecraftCommand = require("../../contracts/minecraftCommand.js");
// @ts-ignore
const { get } = require("axios");

class ChickenCommand extends minecraftCommand {
  /** @param {import("minecraft-protocol").Client} minecraft */
  constructor(minecraft) {
    super(minecraft);

    this.name = "chicken";
    this.aliases = ["chickens", "lockjaw"];
    this.description = "Random cute image of a chickens.";
    this.options = [];
  }

  /**
   * @param {string} player
   * @param {string} message
   * */
  async onCommand(player, message) {
    // CREDITS: by @Kathund (https://github.com/Kathund)
    try {
      const { data, status } = await get("https://imgs.kath.lol/chicken");
      if (status !== 200) {
        throw "An error occured while fetching the image. Please try again later.";
      }

      if (data?.url === undefined) {
        throw "An error occured while fetching the image. Please try again later.";
      }

      const buffer = await get(data.url, { responseType: "arraybuffer" });
      await uploadImage(buffer.data);

      this.send("Chicken image uploaded to Discord channel.");
    } catch (error) {
      this.send(`[ERROR] ${error ?? "Something went wrong.."}`);
    }
  }
}

module.exports = ChickenCommand;
