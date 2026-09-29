import BlacklistManager from "./blacklist/BlacklistManager.ts";
import InactivityManager from "./inactivity/InactivityManager.ts";
import LinkedManager from "./linked/LinkedManager.ts";
import { mkdir } from "node:fs/promises";
import type Application from "../Application.ts";
import type { Lifecycle } from "../core/Lifecycle.ts";

class DataManager implements Lifecycle {
  readonly blacklist: BlacklistManager;
  readonly inactivity: InactivityManager;
  readonly linked: LinkedManager;
  constructor(readonly application: Application) {
    this.blacklist = new BlacklistManager(this);
    this.inactivity = new InactivityManager(this);
    this.linked = new LinkedManager(this);
  }

  async start(): Promise<void> {
    await mkdir("./data/", { recursive: true });
    await Promise.all([this.blacklist.start(), this.inactivity.start(), this.linked.start()]);
  }

  async stop(): Promise<void> {
    await Promise.all([this.blacklist.stop(), this.inactivity.stop(), this.linked.stop()]);
  }
}

export default DataManager;
