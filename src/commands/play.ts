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
 * @param {ShrekBot}   Bot Own reference of Shrek bot.
 *
 * @param {Discord.Message}   Message Discord message.
 *
 * @param {Array}   Array of arguments.
 *
 * @return {void}
 */
export function run(_client: ShrekBot, _message: Discord.Message, _args: string[]) {
  //Delete this command
  _message.delete();

  const voiceState = _message.guild.voice;
  if (!voiceState){
    return error(`Bot is not connected to any channel in ${_message.guild.name}`);
  }

  const voiceConncetion = voiceState.connection;
  if (voiceConncetion === null) {
    return error(`Bot is not connected to any channel in ${_message.guild.name}`);
  }

  voiceConncetion.play(
    ytdl("https://www.youtube.com/watch?v=ZlAU_w7-Xp8", { quality: "highestaudio" })
  );
}
