
//When any message is recieved this gets called
export const event = (_client, _message) => {
  let Bot = _client.Bot;
  let Config = _client.Config;
  // Ignore all bots
  if (_message.author.bot) return;

  // Ignore messages not starting with the prefix (in config.json)
  if (_message.content.indexOf(Config.Prefix) !== 0) return;

  // Our standard argument/command name definition.
  const args = _message.content.slice(Config.Prefix.length).trim().match(/(?:[^\s"]+|"[^"]*")+/g);
  const command = args.shift().toLowerCase();

  // Grab the command data from the client.commands Enmap
  const cmd = Bot.commands.get(command);

  // If that command doesn't exist, silently exit and do nothing
  if (!cmd) return;

  // Run the command
  cmd(_client, _message, args);
};