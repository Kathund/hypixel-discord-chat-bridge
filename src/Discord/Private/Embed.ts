import { EmbedBuilder } from "discord.js";

export class BasicEmbed extends EmbedBuilder {
  constructor() {
    super();
    this.setColor(3447003);
    this.setTimestamp();
  }
}

export default class Embed extends BasicEmbed {
  constructor() {
    super();
    this.setColor(3447003);
    this.setTimestamp();
    this.setFooter({ text: "by @duckysolucky | /help [command] for more information", iconURL: "https://imgur.com/tgwQJTX.png" });
  }
}

export class ErrorEmbed extends Embed {
  constructor(description: string | null = null) {
    super();
    this.setColor(15548997);
    this.setAuthor({ name: "An Error has occurred" });
    this.setDescription(description);
  }
}

export class SuccessEmbed extends Embed {
  constructor(description: string | null = null) {
    super();
    this.setColor(5763719);
    this.setAuthor({ name: "Success" });
    this.setDescription(description);
  }
}
