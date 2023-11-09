process.on('uncaughtException', (error: any) => console.log(error));
import App from './src/Application';

('use strict');

App.register()
  .then(() => {
    App.connect();
  })
  .catch((error: any) => {
    console.error(error);
  });
