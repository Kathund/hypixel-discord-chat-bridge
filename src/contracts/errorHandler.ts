export class HypixelDiscordChatBridgeError extends Error {
  source: any;
  constructor(message: string, source: string) {
    super(message);
    this.name = 'HypixelDiscordChatBridgeError';
    this.source = source;
  }

  toString() {
    return this.message;
  }
}
