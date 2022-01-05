/* External imports */
import Discord from "discord.js";

/** Own Modules */
import { ShrekBot } from "../shrekBot";

//When any message is received this gets called
export const event = (_client: ShrekBot, _message: Discord.Message) => {
  const resourceManager = _client.ResMng;
  const Bot = _client.Bot;
  const Guild = _message.guild;
  if (!Bot || !Guild) {
    return console.error("Bot or Guild (or both) is null in message event.");
  }
  const Config = resourceManager.Config;
  const GuildID = Guild.id;
 


  // Ignore all bots
  if (_message.author.bot) return;

  /**
   * check if it has mentioned the bot
   */
  const Mentions = _message.mentions;

  /* *********************************************************************** */
  /*                              Commands                            
  /* *********************************************************************** */

  // Ignore messages not starting with the prefix (in config.json)
  if (_message.content.indexOf(Config.Prefix) !== 0 || _message.content === Config.Prefix) return;

  const FixedMessage = _message.content.toLocaleLowerCase();

  // Our standard argument/command name definition.
  const Args = FixedMessage
    .slice(Config.Prefix.length)
    .trim()
    .match(/(?:[^\s"]+|"[^"]*")+/g);

    //Check if not null
  if (!Args) { return; }

  for (let i = 0; i < Args.length; i++) {
    Args[i] = Args[i].toString().replace(/"/g, "");
  }

  //Take the [0] arg which is the actual command
  const CommandName = Args.shift();
  if (!CommandName) { return; }

  // Grab the command data from the client.commands map
  const Command = _client.Commands.get(CommandName);

  // If that command doesn't exist, silently exit and do nothing
  if (!Command) {
    _client.logIntoGuildFile(GuildID, `Command ${CommandName} not found.`);
    return;
  }

  // Try To run command
  try{
    Command(_client, _message, Args);
  }
  catch(_err){
    _client.errorIntoGuildFile(GuildID, `Error reported trying to execute command "${CommandName}", ${_err}`);
  }
};
