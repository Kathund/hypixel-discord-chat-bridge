import Script from '../Private/Script.js';
import { exec } from 'node:child_process';
import { updateMessage } from '../../Private/Logger.js';
import type ScriptManager from '../ScriptsManager.js';

class UpdateCodeScript extends Script {
  constructor(scripts: ScriptManager) {
    super(scripts, {
      enabled: scripts.Application.config.other.autoUpdater,
      id: 'updateCode',
      interval: scripts.Application.config.other.autoUpdaterInterval * 60 * 60 * 1000
    });
    this.execute();
  }

  override execute(): void {
    if (this.scripts.Application.config.other.autoUpdater === false) return;
    exec('git pull', (error, stdout, stderr) => {
      if (error) return console.error(error);

      // console.log(`Git pull output: ${stdout}`);

      if (stdout === 'Already up to date.\n') return;

      updateMessage();
    });
  }
}

export default UpdateCodeScript;
