import ConfigManager from "../src/ConfigManager.js";
import InformationCommand from "../src/discord/commands/informationCommand.js";
import { addFile, addTable, saveFile } from "./utils.js";
import { getDiscordCommandPermission } from "../src/utils/discordUtils.js";

let lines: string[] = [];
const config = await new ConfigManager().init();
const { default: Application } = await import("../src/Application.js");
const application = new Application(config, false);

lines = await addFile("./scripts/templates/commands/permissions.md", lines);

lines.push(
  "",
  "# Commands",
  "",
  "`()` = **required** argument, `[]` = **optional** argument",
  "",
  "`u` = Minecraft Username",
  "",
  "## Minecraft Commands",
  "",
  "Minecraft commands can be executed from any chat channel that the bot can see. This includes guild and officer chat.",
  ""
);

await Promise.all([application.minecraft.commandHandler.deployCommands(true), application.discord.commandHandler.deployCommands(true, true)]);

lines = addTable(
  [
    ["Command", "Description", "Aliases", "Syntax", "Permission"],
    ...application.minecraft.commandHandler.commands.map((command) => {
      const optionsString = command.data.options.map((option) => InformationCommand.FormatCommandOptions(option.name, option.required)).join("");

      return [
        `\`${command.data.name}\``,
        command.data.description,
        command.data.aliases.length ? command.data.aliases.join(", ") : "None",
        `\`!${command.data.name}${optionsString}\``,
        "Anyone"
      ];
    })
  ],
  lines
);

lines.push("", "## Discord Commands", "");

lines = addTable(
  [
    ["Command", "Description", "Syntax", "Permission"],
    ...application.discord.commandHandler.commands.map((command) => {
      const { options } = command.data.toJSON();

      const optionsString = options?.map(({ name, required }) => InformationCommand.FormatCommandOptions(name, required)).join("") ?? "";

      return [`\`${command.data.name}\``, command.data.description, `\`/${command.data.name}${optionsString}\``, getDiscordCommandPermission(command.flags)];
    })
  ],
  lines
);

lines.push("");

lines = await addFile("./scripts/templates/commands/footer.md", lines);
await saveFile("docs/Commands.md", lines.join("\n"));

process.exit(0);
