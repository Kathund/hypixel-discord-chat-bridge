class EventHandler {
  // eslint-disable-next-line no-unused-vars
  registerEvents(bot) {
    throw new Error("Event Handler registerEvents is not implemented yet!");
  }

  send(message) {
    if (this.minecraft.bot.player !== undefined) {
      this.minecraft.bot.chat(message);
    }
  }
}

export default EventHandler;
