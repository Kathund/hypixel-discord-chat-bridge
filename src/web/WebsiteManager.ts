import { EndpointHandler } from './handlers/EndpointHandler';
import { web } from '../../config.json';
import express, { json } from 'express';
import { webMessage } from '../Logger';

export class WebManager {
  app: any;
  port: number;
  endpointHandler: any;
  web: any;
  constructor(app: any) {
    this.app = app;
    this.port = web.port;
    this.endpointHandler = new EndpointHandler(this);
  }

  connect() {
    if (web.enabled === false) return;

    this.web = express();
    this.web.use(json());

    this.endpointHandler.registerEvents();

    this.web.listen(this.port, () => {
      webMessage(`Server running at http://localhost:${this.port}/`);
    });
  }
}
