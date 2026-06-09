import BlacklistManager from "./blacklist/BlacklistManager.js";
import LinkedManager from "./linked/LinkedManager.js";
import type Application from "../Application.js";

class DataManager {
  readonly blacklist: BlacklistManager;
  readonly linked: LinkedManager;
  constructor(readonly application: Application) {
    this.linked = new LinkedManager(this);
    this.blacklist = new BlacklistManager(this);
  }
}

export default DataManager;
