import { log } from "../Helpers.js";

//When any message is recieved this gets called
export const event = (_client, _message) => {
  const Bot = _client.Bot;
  const Config = _client.Config;
  const Channel = _message.channel;

  // Ignore all bots
  if (_message.author.bot) return;

  /**
   * check if it has mentioned the bot
   */
  const Mentions = _message.mentions;
  if (Mentions.has(_client.Bot.user)) {
    const BotVoice = _message.guild.voice;
    if (!BotVoice) {
      return Channel.send("No esté chiflando ahorita, caramba!")
    }

    const VoiceConnection = BotVoice.connection;
    if (!VoiceConnection) {
      return Channel.send("No esté chiflando ahorita, caramba!")
    }

    VoiceConnection.play(_client.Config.SoundsPath +  "noEsteChflando.mp3");
  }


  /* *********************************************************************** */
  /*                              Commands                            
  /* *********************************************************************** */

  // Ignore messages not starting with the prefix (in config.json)
  if (_message.content.indexOf(Config.Prefix) !== 0 || _message.content === ".") return;

  // Our standard argument/command name definition.
  const args = _message.content.slice(Config.Prefix.length).trim().match(/(?:[^\s"]+|"[^"]*")+/g);
  for (let i = 0; i < args.length; i++) {
    args[i] = args[i].toString().replace(/"/g, '');
  }
  const command = args.shift().toLowerCase();

  // Grab the command data from the client.commands Enmap
  const cmd = Bot.commands.get(command);

  // If that command doesn't exist, silently exit and do nothing
  if (!cmd) return;

  // Run the command
  cmd(_client, _message, args);
};