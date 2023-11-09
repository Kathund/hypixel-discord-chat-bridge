import { updateMessage } from './Logger.js';
import { other } from '../config.json';
import { schedule } from 'node-cron';
import { exec } from 'child_process';

function updateCode() {
  if (other.autoUpdater === false) {
    return;
  }

  exec('git pull', (error, stdout, stderr) => {
    if (error) {
      console.error(`Git pull error: ${error}`);
      return;
    }

    // console.log(`Git pull output: ${stdout}`);

    if (stdout === 'Already up to date.\n') {
      return;
    }

    updateMessage();
  });
}

schedule(`0 */${other.autoUpdaterInterval} * * *`, () => updateCode());
updateCode();
