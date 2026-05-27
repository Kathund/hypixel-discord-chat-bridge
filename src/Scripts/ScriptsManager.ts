import { Collection } from 'discord.js';
import { readdirSync } from 'node:fs';
import type Application from '../Application.js';
import type Script from './Private/Script.js';

class ScriptManager {
  readonly scripts: Collection<string, Script> = new Collection<string, Script>();
  constructor(readonly Application: Application) {
    this.init();
  }

  private async init() {
    const buttonFiles = readdirSync('./src/Scripts/Scripts/', { recursive: true, encoding: 'utf-8' }).filter((file) => file.endsWith('.ts'));
    for (const file of buttonFiles) {
      const script: Script = new (await import(`./Scripts/${file}`)).default(this);
      this.scripts.set(script.id, script);
    }
    console.scripts(`Successfully loaded ${this.scripts.size} script(s).`);
  }
}

export default ScriptManager;
