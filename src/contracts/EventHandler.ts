export class EventHandler {
  minecraft: any;
  registerEvents(bot: any) {
    throw new Error('Event Handler registerEvents is not implemented yet!');
  }
  send(message: any) {
    if (this.minecraft.bot.player !== undefined) {
      this.minecraft.bot.chat(message);
    }
  }
}
