/**
 * @Description Play music command.
 *
 * @author Accel Magaña Rodriguez. <accel.mr@gmail.com>
 */

/* External imports */
import Discord from "discord.js";
import ytdl from "ytdl-core";

/** Own modules  */
import { error, log } from "../Helpers/helpers";
import { ShrekBot } from "../shrekBot";

//Triggers to call this command
export const Triggers: string[] = ["play"];

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
  const voiceState = _message.guild?.voice;
  const voiceConnection = voiceState?.connection;
  const Channel = _message.channel;

  //Delete this command
  _message.delete();

  if (!voiceState || !voiceConnection) {
    return error(`Bot is not connected to any channel in ${_message.guild?.name}`);
  }

  const URLVideo = _args[0];
  const IsURLValid = ytdl.validateURL(URLVideo);

  if (!IsURLValid) {
    error(`URL -${URLVideo}- is not valid `);
    const message = `Esa URL ta chueca mi mai.`;
    Channel.send(message);
    return
  }

  

  voiceConnection.play(ytdl(_args[0], { quality: "highestaudio" }), { volume: 0.05 });
}
