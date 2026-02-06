import MinecraftCommand from "../../contracts/MinecraftCommand.js";
import { timeToSkyblockYear } from "../../contracts/helperFunctions.js";

/*
Derpy = 368 mod 24 = 8
Jerry = 376 mod 24 = 16
Scorpius = 384 mod 24 = 0
https://hypixel-skyblock.fandom.com/wiki/Mayor_Election#Special_Candidates_Election_Cycle
*/

const currentSkyblockYear = timeToSkyblockYear(Date.now());

let yearsUntilSpecial = 0;
let diffSkyblockYear = currentSkyblockYear;
let specialMayor = "";

/**
 * Returns the special mayor for the given year
 * @returns {string}
 */
function getSpecialMayor() {
  if (diffSkyblockYear % 24 === 8) {
    specialMayor = "Derpy";
  } else if (diffSkyblockYear % 24 === 16) {
    specialMayor = "Jerry";
  } else if (diffSkyblockYear % 24 === 0) {
    specialMayor = "Scorpius";
  } else {
    specialMayor = "Error!";
  }

  return specialMayor;
}

class SpecialMayorCommand extends MinecraftCommand {
  /** @param {import("minecraft-protocol").Client} minecraft */
  constructor(minecraft) {
    super(minecraft);

    this.name = "specialmayor";
    this.aliases = ["specmayor"];
    this.description = "How many years until next special mayor, along with speculated special mayor.";
    this.options = [];
  }

  /**
   * @param {string} player
   * @param {string} message
   * */
  // eslint-disable-next-line no-unused-vars
  onCommand(player, message) {
    try {
      if (currentSkyblockYear % 8 === 0) {
        specialMayor = getSpecialMayor();
        this.send(`Special Mayor this year! It is speculated to be ${specialMayor}.`);
      } else {
        while (diffSkyblockYear % 8 !== 0) {
          yearsUntilSpecial += 1;
          diffSkyblockYear += 1;
          specialMayor = getSpecialMayor();
        }

        this.send(`Not Special Mayor, ${yearsUntilSpecial} years until the next one! It is speculated to be ${specialMayor}.`);
      }
    } catch (error) {
      console.log(error);
      this.send(`[ERROR] ${error}`);
    }
  }
}

export default SpecialMayorCommand;
