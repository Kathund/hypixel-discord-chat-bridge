import LinkedManager from "./linked/LinkedManager.js";
import type Application from "../Application.js";

class DataManager {
  readonly linked: LinkedManager;
  constructor(readonly application: Application) {
    this.linked = new LinkedManager(this);
  }
}

export default DataManager;
