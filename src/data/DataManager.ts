import BlacklistManager from "./blacklist/BlacklistManager.js";
import LinkedManager from "./linked/LinkedManager.js";
import { mkdir } from "node:fs/promises";
import type Application from "../Application.js";

class DataManager {
  readonly blacklist: BlacklistManager;
  readonly linked: LinkedManager;
  constructor(readonly application: Application) {
    this.init();
    this.linked = new LinkedManager(this);
    this.blacklist = new BlacklistManager(this);
  }

  private async init() {
    await mkdir("./data/", { recursive: true });
  }
}

export default DataManager;
