export class CommunicationBridge {
  bridge: any;
  constructor() {
    this.bridge = null;
  }

  getBridge() {
    return this.bridge;
  }

  setBridge(bridge: any) {
    this.bridge = bridge;
  }

  broadcastMessage(event: any) {
    return this.bridge.onBroadcast(event);
  }

  broadcastPlayerToggle(event: any) {
    return this.bridge.onPlayerToggle(event);
  }

  broadcastCleanEmbed(event: any) {
    return this.bridge.onBroadcastCleanEmbed(event);
  }

  broadcastHeadedEmbed(event: any) {
    return this.bridge.onBroadcastHeadedEmbed(event);
  }
}
