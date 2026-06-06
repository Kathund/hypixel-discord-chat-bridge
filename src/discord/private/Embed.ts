import { CommonDevs } from "../../private/constants.js";
import { EmbedBuilder } from "discord.js";
import type { Devs } from "../../types/misc.js";

export class BasicEmbed extends EmbedBuilder {
  constructor() {
    super();
    this.setColor(3447003);
    this.setTimestamp();
  }

  setDevFooter(dev: Devs): this {
    const { username, iconURL } = CommonDevs[dev];
    this.setFooter({ text: `by @${username} | /help [command] for more information`, iconURL });
    return this;
  }
}

export default class Embed extends BasicEmbed {
  constructor() {
    super();
    this.setDevFooter("DuckySoLucky");
  }
}

export class ErrorEmbed extends Embed {
  constructor() {
    super();
    this.setColor(15548997);
    this.setAuthor({ name: "An Error has occurred" });
  }
}

export class SuccessEmbed extends Embed {
  constructor() {
    super();
    this.setColor(5763719);
    this.setAuthor({ name: "Success" });
  }
}
