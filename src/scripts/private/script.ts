import HypixelDiscordChatBridgeError from "../../private/error.js";
import prettyMilliseconds from "pretty-ms";
import { schedule } from "node-cron";
import type ScriptManager from "../ScriptsManager.js";
import type { ScriptOptions } from "../../types/scripts.js";

class Script {
  enabled: boolean;
  id: string;
  cron?: string;
  interval?: number;
  constructor(
    protected readonly scripts: ScriptManager,
    options: ScriptOptions
  ) {
    const { enabled, id, cron, interval } = options;
    this.enabled = enabled;
    this.id = id;
    if (!cron && !interval) throw new HypixelDiscordChatBridgeError("You must specify a cron or an interval.");
    if (cron && interval) throw new HypixelDiscordChatBridgeError("You cannot specify both cron and an interval.");
    this.cron = cron;
    this.interval = interval;
    this.init();
  }

  execute(): Promise<void> | void {
    throw new Error("Execute Method not implemented!");
  }

  private run() {
    console.scripts(`Executing the \`${this.id}\` script.`);
    this.execute();
  }

  private init() {
    if (!this.enabled) return console.scripts(`Script \`${this.id}\` is disabled.`);

    if (this.interval) {
      console.scripts(`Loaded script \`${this.id}\` - executing every ${this.interval}ms (${prettyMilliseconds(this.interval)})`);
      setInterval(() => this.run(), this.interval);
    }

    if (this.cron) {
      console.scripts(`Loaded script \`${this.id}\` - executing with cron: ${this.cron}.`);
      schedule(this.cron, () => this.run());
    }
  }
}

export default Script;
