import MinecraftCommand from "../../contracts/MinecraftCommand.js";
import { delay } from "../../contracts/helperFunctions.js";

class BooCommand extends MinecraftCommand {
  /** @param {import("minecraft-protocol").Client} minecraft */
  constructor(minecraft) {
    super(minecraft);

    this.name = "boo";
    this.aliases = [];
    this.description = "Boo someone!";
    this.options = [
      {
        name: "username",
        description: "User you want to boo!",
        required: true
      }
    ];
    this.isOnCooldown = false;
  }

  /**
   * @param {string} player
   * @param {string} message
   * */
  async onCommand(player, message) {
    try {
      const args = this.getArgs(message);
      if (args.length === 0) {
        throw new Error("You must provide a user to boo!");
      }

      if (new Date().getMonth() !== 9) {
        throw new Error("You can only do this during Halloween!");
      }

      if (this.isOnCooldown) {
        return this.send(`${this.name} Command is on cooldown`);
      }

      this.isOnCooldown = true;
      bot.chat(`/boo ${args[0]}`);
      await delay(1000);
      bot.chat(`/msg ${args[0]} ${player} Booed You!`);
      await delay(1000);
      this.send(`Booed ${args[0]}!`);

      setTimeout(() => {
        this.isOnCooldown = false;
      }, 30000);
    } catch (error) {
      this.send(`[ERROR] ${error}`);
      this.isOnCooldown = false;
    }
  }
}

export default BooCommand;
