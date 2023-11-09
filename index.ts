process.on('uncaughtException', (error: Error) => console.log(error));
import App from './src/Application';

('use strict');

App.register()
  .then(() => {
    App.connect();
  })
  .catch((error: Error) => {
    console.error(error);
  });
