import { EndpointHandler } from './handlers/EndpointHandler.js';
import { webMessage } from '../Logger.js';
import { web } from '../../config.json';
import express, { json } from 'express';

export class WebManager {
  constructor(app) {
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
