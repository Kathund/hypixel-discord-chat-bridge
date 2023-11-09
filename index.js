process.on('uncaughtException', (error) => console.log(error));
import App from './src/Application.js';

('use strict');

App.register()
  .then(() => {
    App.connect();
  })
  .catch((error) => {
    console.error(error);
  });
