import MinecraftCommand from "../../contracts/MinecraftCommand.js";
import axios from "axios";

class EightBallCommand extends MinecraftCommand {
  /** @param {import("minecraft-protocol").Client} minecraft */
  constructor(minecraft) {
    super(minecraft);

    this.name = "8ball";
    this.aliases = ["8b"];
    this.description = "Ask an 8ball a question.";
    this.options = [
      {
        name: "question",
        description: "The question you want to ask the 8ball",
        required: true
      }
    ];
  }

  /**
   * @param {string} player
   * @param {string} message
   * */
  async onCommand(player, message) {
    try {
      if (this.getArgs(message).length === 0) {
        throw new Error("You must provide a question.");
      }

      const response = await axios.get(`https://www.eightballapi.com/api`);
      if (response?.data === undefined) {
        return this.send("Wouldn't you like to know weather boy.");
      }

      this.send(`${response.data.reading}`);
    } catch (error) {
      this.send(`[ERROR] ${error}`);
    }
  }
}

export default EightBallCommand;
