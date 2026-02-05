class HypixelDiscordChatBridgeError extends Error {
  constructor(message, source) {
    super(message);
    this.name = "HypixelDiscordChatBridgeError";
    this.source = source;
  }

  toString() {
    return this.message;
  }
}

export default HypixelDiscordChatBridgeError;
