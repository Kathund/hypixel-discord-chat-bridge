export type broadcast = {
  fullMessage?: any;
  chat?: any;
  chatType?: any;
  username: any;
  rank?: any;
  guildRank?: any;
  message: any;
  color?: any;
  channel?: any;
  replyingTo?: any;
  discord?: any;
};

export type broadcastCleanEmbed = {
  message: any;
  color: any;
  channel: any;
};

export type broadcastHeadedEmbed = {
  message: any;
  title: any;
  icon: any;
  color: any;
  channel: any;
};

export type playerToggle = {
  fullMessage: any;
  username: any;
  message: any;
  color: any;
  channel: any;
};

declare global {
  var bot: any;
  var client: any;
}
