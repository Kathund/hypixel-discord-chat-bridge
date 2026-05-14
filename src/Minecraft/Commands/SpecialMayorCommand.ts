import Command from "../Private/Command.js";
import CommandData from "../Private/CommandData.js";
import type { MinecraftManagerWithBot } from "../../Types/Minecraft.js";

/*
Derpy = 368 mod 24 = 8
Jerry = 376 mod 24 = 16
Scorpius = 384 mod 24 = 0
https://hypixel-skyblock.fandom.com/wiki/Mayor_Election#Special_Candidates_Election_Cycle
*/

const hourMs = 50_000;
const dayMs = 24 * hourMs;
const monthLength = 31;
const yearLength = 12;

const yearMs = yearLength * monthLength * dayMs;
const yearZero = 1560275700000;

class SpecialMayorCommand extends Command {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new CommandData().setName("specialmayor").setAliases(["specmayor"]);
  }

  getYearsUntilSpecial(year: number): number {
    return (8 - (year % 8)) % 8;
  }

  timeToSkyblockYear(time: number): number {
    return Math.floor((time - yearZero) / yearMs) + 1;
  }

  getSpecialMayor(year: number): string | null {
    switch (year % 24) {
      case 8:
        return "Derpy";
      case 16:
        return "Jerry";
      case 0:
        return "Scorpius";
      default:
        return null;
    }
  }

  override execute(username: string, message: string) {
    const currentYear = this.timeToSkyblockYear(Date.now());
    const yearsUntil = this.getYearsUntilSpecial(currentYear);

    const targetYear = currentYear + yearsUntil;
    const mayor = this.getSpecialMayor(targetYear);

    if (yearsUntil === 0) {
      this.send(`Special Mayor this year! It is speculated to be ${mayor}.`);
    } else {
      this.send(`Not a Special Mayor year. ${yearsUntil} year(s) until the next one! It is speculated to be ${mayor}.`);
    }
  }
}

export default SpecialMayorCommand;
