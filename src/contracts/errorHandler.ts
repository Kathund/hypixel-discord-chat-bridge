export class HypixelDiscordChatBridgeError extends Error {
  source: any;
  constructor(message: any, source: any) {
    super(message);
    this.name = 'HypixelDiscordChatBridgeError';
    this.source = source;
  }

  toString() {
    return this.message;
  }
}
