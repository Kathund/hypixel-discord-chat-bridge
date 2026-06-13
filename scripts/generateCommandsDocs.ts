import ConfigManager from "../src/ConfigManager.js";
import InformationCommand from "../src/discord/commands/informationCommand.js";
import { CommandFlags } from "../src/types/discord.js";
import { format } from "prettier";
import { markdownTable } from "markdown-table";
import { readFile, writeFile } from "node:fs/promises";

(async () => {
  const configManager = new ConfigManager();
  const config = await configManager.init();

  const { default: Application } = await import("../src/Application.js");
  const application = new Application(config, false);

  const lines: string[] = [];
  await readFile("./scripts/templates/commands/permissions.md", "utf-8").then((file) => file.split("\n").forEach((line) => lines.push(line.trim())));
  lines.push("");
  lines.push("# Commands");
  lines.push("");
  lines.push("`()` = **required** argument, `[]` = **optional** argument");
  lines.push("");
  lines.push("`u` = Minecraft Username");
  lines.push("");

  lines.push("## Minecraft Commands");
  lines.push("");
  lines.push("Minecraft commands can be executed from any chat channel that the bot can see. This includes guild and officer");
  lines.push("");
  await application.minecraft.commandHandler.deployCommands(true);
  markdownTable([
    ["Command", "Description", "Aliases", "Syntax", "Permission"],
    ...application.minecraft.commandHandler.commands.map((command) => {
      const optionsString = command.data.options.map((option) => InformationCommand.FormatCommandOptions(option.name, option.required)).join("");
      return [
        `\`${command.data.name}\``,
        command.data.description,
        `${command.data.aliases.length > 0 ? command.data.aliases.join(", ") : "None"}`,
        `\`!${command.data.name}${optionsString}\``,
        "Anyone"
      ];
    })
  ])
    .split("\n")
    .forEach((line) => lines.push(line.trim()));

  lines.push("");
  lines.push("## Discord Commands");
  lines.push("");
  await application.discord.commandHandler.deployCommands(true, true);
  markdownTable([
    ["Command", "Description", "Syntax", "Permission"],
    ...application.discord.commandHandler.commands.map((command) => {
      const { options } = command.data.toJSON();
      const optionsString = options?.map(({ name, required }) => InformationCommand.FormatCommandOptions(name, required)).join("");
      return [
        `\`${command.data.name}\``,
        command.data.description,
        `\`/${command.data.name}${optionsString}\``,
        command.flags.includes(CommandFlags.AdminOnly) ? "Admin" : command.flags.includes(CommandFlags.StaffOnly) ? "Staff" : "Anyone"
      ];
    })
  ])
    .split("\n")
    .forEach((line) => lines.push(line.trim()));

  lines.push("");
  await readFile("./scripts/templates/commands/footer.md", "utf-8").then((file) => file.split("\n").forEach((line) => lines.push(line.trim())));
  lines.push("");

  const prettierFile = await readFile("./.prettierrc", "utf-8");
  const prettierConfig = JSON.parse(prettierFile);
  const formatted = await format(lines.join("\n"), { ...prettierConfig, filepath: "docs/Commands.md" });
  await writeFile("docs/Commands.md", formatted, "utf-8");

  console.other("File Saved");
  process.exit(1);
})();
