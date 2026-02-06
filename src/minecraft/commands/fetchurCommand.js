import MinecraftCommand from "../../contracts/MinecraftCommand.js";
import { getFetchur } from "../../../API/functions/getFetchur.js";

class FetchurCommand extends MinecraftCommand {
  /** @param {import("minecraft-protocol").Client} minecraft */
  constructor(minecraft) {
    super(minecraft);

    this.name = "fetchur";
    this.aliases = [];
    this.description = "Information about an item for Fetchur.";
    this.options = [];
  }

  /**
   * @param {string} player
   * @param {string} message
   * */
  // eslint-disable-next-line no-unused-vars
  onCommand(player, message) {
    try {
      const { text, description } = getFetchur();

      this.send(`Fetchur Requests: ${text} | Description: ${description}`);
    } catch (error) {
      this.send(`[ERROR] ${error || "Something went wrong.."}`);
    }
  }
}

export default FetchurCommand;
