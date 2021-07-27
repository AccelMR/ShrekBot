
/**
 * @Description Leave command.
 * 
 * @author Accel Magaña Rodriguez. <accel.mr@gmail.com>
 */

/* External imports */
import Discord from "discord.js";

/** Own modules  */
import { log } from "../Helpers/helpers";
import { ShrekBot } from "../shrekBot";

//Triggers to call this command
export const Triggers: string[] = ["leave"];

/**
 * Summary.Makes the bot to leave the server.
 *
 * @access  public
 *
 * @param {ShrekBot}          Bot Own reference of Shrek bot.
 *
 * @param {Discord.Message}   Message Discord message.
 *
 * @param {Array}             Array of arguments.
 * 
 * @return {void} 
 */
export function run(_client: ShrekBot, _message: Discord.Message, _args : string[]){
  const VoiceState = _message.guild?.voice;
  if(!VoiceState){return;}

  const VoiceChannel = VoiceState.channel;
  if(!VoiceChannel){return;}

  VoiceChannel.leave();
  
  //Delete this command
  _message.delete();
};
