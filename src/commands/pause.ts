/**
 * @Description Pause music command.
 *
 * @author Accel Magaña Rodriguez. <accel.mr@gmail.com>
 */


/* External imports */
import Discord from "discord.js";

/** Own modules  */
import { error, log } from "../Helpers/helpers";
import { ShrekBot } from "../shrekBot";

//Triggers to call this command
export const Triggers: string[] = ["pause"];

/**
 * Summary.Play audio from Youtube.
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
export function run(_client: ShrekBot, _message: Discord.Message, _args: string[]) {
  //Delete this command
  _message.delete();

  const voiceState = _message.guild?.voice;
  const voiceConnection = voiceState?.connection;
  if (!voiceState || !voiceConnection) {
    return error(`Bot is not connected to any channel in ${_message.guild?.name}`);
  }

  if(!voiceConnection.dispatcher)
  {
    error(`There's nothing to pause.`);
    return;
  }


  voiceConnection.dispatcher.pause();
}
