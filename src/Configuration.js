import { configUpdateMessage } from "./Logger.js";
import { readFileSync, writeFileSync } from "fs";

const exampleConfig = JSON.parse(readFileSync("config.example.json"));
const config = JSON.parse(readFileSync("config.json"));

function checkConfig(object, exampleObject) {
  for (const [key, value] of Object.entries(exampleObject)) {
    if (key === "messageFormat" && object[key] && object[key].length <= 2) {
      object[key] = value;
    }

    if (object[key] === undefined) {
      object[key] = value;
      configUpdateMessage(`${key}: ${JSON.stringify(value)}`);
    }

    if (typeof value === "object") {
      checkConfig(object[key], exampleObject[key]);
    }
  }
}

for (const [key, value] of Object.entries(exampleConfig)) {
  if (config[key] === undefined) {
    config[key] = value;
    configUpdateMessage(`${key}: ${JSON.stringify(value)}`);
  }

  if (typeof value === "object") {
    checkConfig(config[key], exampleConfig[key]);
  }
}

writeFileSync("config.json", JSON.stringify(config, null, 2));
