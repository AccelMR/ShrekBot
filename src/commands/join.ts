/**
 * @Description Join command.
 *
 * @author Accel Magaña Rodriguez. <accel.mr@gmail.com>
 */

/* External imports */
import Discord, { GuildMember } from "discord.js";
import { getChannelByName } from "../Helpers/discordHelper";

/** Own modules  */
import { log, error } from "../Helpers/helpers";
import { ShrekBot } from "../shrekBot";

//Triggers to call this command
export const Triggers: string[] = ["join"];

/**
 * Summary.Command to make the bot connect to a certain voice channel.
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
  //Get username of the one who calle this command
  const userName = _message.author.username;
  const member = _message.member;
  const Guild = _message.guild;
  if (!Guild) return error("Guild Id undefined in Join command");

  let voiceChannel = member?.voice.channel;

  if (_args.length > 0) {
    voiceChannel = getChannelByName(_args[0], Guild) as Discord.VoiceChannel;
  }

  //Delete this command
  _message.delete();

  if (!voiceChannel) return log(`No voice channel found for ${userName}`);

  voiceChannel?.join();
}
