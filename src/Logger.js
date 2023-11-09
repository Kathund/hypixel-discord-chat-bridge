import chalk from 'chalk';

export const discordMessage = (message) => {
  return console.log(chalk.bgMagenta.black(`[${getCurrentTime()}] Discord >`) + ' ' + chalk.magenta(message));
};

export const minecraftMessage = (message) => {
  return console.log(chalk.bgGreenBright.black(`[${getCurrentTime()}] Minecraft >`) + ' ' + chalk.greenBright(message));
};

export const webMessage = (message) => {
  return console.log(chalk.bgCyan.black(`[${getCurrentTime()}] Web >`) + ' ' + chalk.cyan(message));
};

export const warnMessage = (message) => {
  return console.log(chalk.bgYellow.black(`[${getCurrentTime()}] Warning >`) + ' ' + chalk.yellow(message));
};

export const errorMessage = (message) => {
  return console.log(chalk.bgRedBright.black(`[${getCurrentTime()}] Error >`) + ' ' + chalk.redBright(message));
};

export const broadcastMessage = (message, location) => {
  return console.log(chalk.inverse(`[${getCurrentTime()}] ${location} Broadcast >`) + ' ' + message);
};

export const getCurrentTime = () => {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
};

export const configUpdateMessage = (message) => {
  const columns = process.stdout.columns;
  const warning = 'IMPORTANT!';
  const message2 = 'Please update your Configuration file!';
  const padding = ' '.repeat(Math.floor((columns - warning.length + 1) / 2));
  const padding2 = ' '.repeat(Math.floor((columns - message2.length + 1) / 2));

  console.log(chalk.bgRed.black(' '.repeat(columns).repeat(3)));
  console.log(chalk.bgRed.black(padding + warning + padding));
  console.log(chalk.bgRed.black(padding2 + message2 + padding2));
  console.log(chalk.bgRed.black(' '.repeat(columns).repeat(3)));
  console.log();
  console.log(
    `${chalk.bgRedBright.black(`[${getCurrentTime()}] Config Update >`)} ${chalk.redBright('Added')} ${chalk.gray(
      message
    )} ${chalk.redBright('to config.json')}`
  );
};

export const updateMessage = () => {
  const columns = process.stdout.columns;
  const warning = 'IMPORTANT!';
  const message2 = 'Bot has been updated, please restart the bot to apply changes!';
  const padding = ' '.repeat(Math.floor((columns - warning.length + 1) / 2));
  const padding2 = ' '.repeat(Math.floor((columns - message2.length + 1) / 2));

  console.log(chalk.bgRed.black(' '.repeat(columns).repeat(3)));
  console.log(chalk.bgRed.black(padding + warning + padding));
  console.log(chalk.bgRed.black(padding2 + message2 + padding2));
  console.log(chalk.bgRed.black(' '.repeat(columns).repeat(3)));
};
