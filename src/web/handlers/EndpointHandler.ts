import { Request, Response } from 'express';

export class EndpointHandler {
  server: any;
  constructor(server: any) {
    this.server = server;
  }

  registerEvents() {
    const { web } = this.server;

    web.get('*', this.get.bind(this));
    web.post('*', this.post.bind(this));
  }

  async get(req: Request, res: Response) {
    res.send('API is running.');
  }

  async post(req: Request, res: Response) {
    res.json({ success: true });
  }
}
