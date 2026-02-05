import DiscordCommand from "../../contracts/DiscordCommand.js";
import { Embed } from "../../contracts/embedHandler.js";
import { SlashCommandBuilder } from "discord.js";

class OnlineCommand extends DiscordCommand {
  /** @param {import("../discord/DiscordManager.js").default} discord */
  constructor(discord) {
    super(discord);
    this.data = new SlashCommandBuilder().setName("online").setDescription("List of online members.");
    this.requiresBot = true;
  }

  /** @param {import("discord.js").ChatInputCommandInteraction} interaction */
  async onCommand(interaction) {
    const cachedMessages = [];
    const messages = new Promise((resolve, reject) => {
      const listener = (message) => {
        message = message.toString();

        cachedMessages.push(message);
        if (message.startsWith("Offline Members")) {
          bot.removeListener("message", listener);
          resolve(cachedMessages);
        }
      };

      bot.on("message", listener);
      bot.chat("/g online");

      setTimeout(() => {
        bot.removeListener("message", listener);
        reject("Command timed out. Please try again.");
      }, 5000);
    });

    const message = await messages;

    const onlineMembers = message.find((m) => m.startsWith("Online Members: "));
    const totalMembers = message.find((message) => message.startsWith("Total Members: "));

    const onlineMembersList = message;
    const online = onlineMembersList
      .flatMap((item, index) => {
        if (item.includes("-- ") === false) return;

        const nextLine = onlineMembersList[parseInt(index) + 1];
        if (nextLine.includes("●")) {
          const rank = item.replaceAll("--", "").trim();
          const players = nextLine
            .split("●")
            .map((item) => item.trim())
            .filter((item) => item);

          if (rank === undefined || players === undefined) return;

          return `**${rank}**\n${players.map((item) => `\`${item}\``).join(", ")}`;
        }
      })
      .filter((item) => item);

    const description = `${totalMembers}\n${onlineMembers}\n\n${online.join("\n")}`;
    const embed = new Embed().setAuthor({ name: "Online Members" }).setDescription(description);

    return await interaction.followUp({ embeds: [embed] });
  }
}

export default OnlineCommand;
