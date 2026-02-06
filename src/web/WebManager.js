import WebSocket from "ws";
import config from "../../config.json" with { type: "json" };
import { createServer } from "node:http";

class WebManager {
  constructor(bot) {
    this.bot = bot;
    this.port = config.web.port;
    this.start = Date.now();
  }

  connect() {
    if (config.web.enabled === false) return;

    const server = createServer();
    const wss = new WebSocket.Server({ noServer: true });

    wss.on("connection", (ws) => {
      console.web("Client has connected to the server.");
      ws.on("message", (message) => {
        message = JSON.parse(message);
        if (typeof message !== "object") {
          return;
        }

        if (message.type === "message" && message.token === config.web.token && message.data) {
          console.web(`Received: ${JSON.stringify(message)}`);
          bot.chat(message.data);
        }
      });

      bot.on("message", (message) => {
        ws.send(JSON.stringify(message));
      });
    });

    server.on("upgrade", (request, socket, head) => {
      if (request.url === "/message") {
        wss.handleUpgrade(request, socket, head, (ws) => {
          wss.emit("connection", ws, request);
        });
      }
    });

    server.listen(this.port, () => {
      console.web(`WebSocket running at http://localhost:${this.port}/`);
    });

    server.on("request", (req, res) => {
      if (req.url === "/uptime") {
        res.end(
          JSON.stringify({
            success: true,
            uptime: Date.now() - this.start
          })
        );
      } else {
        res.end(
          JSON.stringify({
            success: false,
            error: "Invalid route"
          })
        );
      }
    });
  }
}

export default WebManager;
