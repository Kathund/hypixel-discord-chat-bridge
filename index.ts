import Application from './src/Application.js';
import ConfigManager from './src/ConfigManager.js';
import './src/Private/Logger';

new ConfigManager();
new Application().connect();
