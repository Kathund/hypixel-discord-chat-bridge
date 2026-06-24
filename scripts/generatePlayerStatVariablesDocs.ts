import {
  PlayerVariableStatsKeyDescriptionMap,
  PlayerVariableStatsKeysBedWars,
  PlayerVariableStatsKeysDuels,
  PlayerVariableStatsKeysGeneral,
  PlayerVariableStatsKeysSkyBlock,
  PlayerVariableStatsKeysSkyWars
} from "../src/private/constants.js";
import { addFile, saveFile } from "./utils.js";

const variableGroups = {
  General: PlayerVariableStatsKeysGeneral,
  BedWars: PlayerVariableStatsKeysBedWars,
  SkyWars: PlayerVariableStatsKeysSkyWars,
  Duels: PlayerVariableStatsKeysDuels,
  SkyBlock: PlayerVariableStatsKeysSkyBlock
};

let lines: string[] = [];
lines = await addFile("./scripts/templates/playerStatVariables/header.md", lines);

Object.entries(variableGroups).forEach(([title, items]) => {
  lines.push(`## ${title}`);
  lines.push("");
  items.forEach((item) => {
    lines.push(`\`{${item}}\` - ${PlayerVariableStatsKeyDescriptionMap[item] ?? "No Description Provided"}`);
    lines.push("");
  });
});

lines = await addFile("./scripts/templates/playerStatVariables/footer.md", lines);
await saveFile("docs/PlayerStatVariables.md", lines);

process.exit(0);
