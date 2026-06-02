import { Collection } from "discord.js";
import { readdirSync } from "node:fs";
import type Application from "../Application.js";
import type BasicScript from "./private/BasicScript.js";

class ScriptManager {
  readonly scripts: Collection<string, BasicScript> = new Collection<string, BasicScript>();
  constructor(readonly application: Application) {
    this.init();
  }

  private async init() {
    const buttonFiles = readdirSync("./src/scripts/scripts/", { recursive: true, encoding: "utf-8" }).filter((file) => file.endsWith(".ts"));
    for (const file of buttonFiles) {
      const script: BasicScript = new (await import(`./scripts/${file}`)).default(this);
      this.scripts.set(script.id, script);
    }
    console.scripts(`Successfully loaded ${this.scripts.size} script(s).`);
  }
}

export default ScriptManager;
