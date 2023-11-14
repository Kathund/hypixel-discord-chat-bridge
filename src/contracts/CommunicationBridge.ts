export class CommunicationBridge {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bridge: any;
  constructor() {
    this.bridge = null;
  }

  getBridge() {
    return this.bridge;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setBridge(bridge: any) {
    this.bridge = bridge;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  broadcastMessage(event: any) {
    return this.bridge.onBroadcast(event);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  broadcastPlayerToggle(event: any) {
    return this.bridge.onPlayerToggle(event);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  broadcastCleanEmbed(event: any) {
    return this.bridge.onBroadcastCleanEmbed(event);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  broadcastHeadedEmbed(event: any) {
    return this.bridge.onBroadcastHeadedEmbed(event);
  }
}
