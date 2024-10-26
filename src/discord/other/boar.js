const { readFileSync } = require("fs");
const cron = require("node-cron");

function boarPing() {
  const boarData = readFileSync("data/boar.json");
  if (!boarData) return;
  const boar = JSON.parse(boarData);
  if (!boar) return;
  let message = "";

  boar.forEach((user) => (message += `<@${user}> `));

  client.channels.fetch("1296611611393527864").then((channel) => {
    if (channel) channel.send(message);
  });
}

cron.schedule(`0 0 * * *`, () => boarPing(), { scheduled: true, timezone: "UTC" });
