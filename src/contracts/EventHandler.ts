export class EventHandler {
  registerEvents() {
    throw new Error('Event Handler registerEvents is not implemented yet!');
  }
  send(message: string) {
    if (global.bot.player !== undefined) {
      global.bot.chat(message);
    }
  }
}
