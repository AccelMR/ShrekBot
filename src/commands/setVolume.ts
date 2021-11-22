/**
 * @Description Change volume command.
 *
 * @author Accel Magaña Rodriguez. <accel.mr@gmail.com>
 */

/* External imports */
import Discord from "discord.js";

/** Own modules  */
import { error, log } from "../Helpers/helpers";
import { ShrekBot } from "../shrekBot";

//Triggers to call this command
export const Triggers: string[] = ["volume"];

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

  const Channel = _message.channel;

  //Delete this command
  _message.delete();

  const voiceState = _message.guild?.voice;
  const voiceConnection = voiceState?.connection;
  if (!voiceState || !voiceConnection) {
    return error(`Bot is not connected to any channel in ${_message.guild?.name}`);
  }

  const volume: number = +_args[0] ?? 0.05;
  if(volume > 1){
    const message = "Tas loco cuate? eso está muy fuerte xddxdx"
    Channel.send(message);
    return;
  }

  voiceConnection.dispatcher.setVolume(volume);
}
