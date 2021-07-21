/**
 * @Description Move/Disconnect command.
 *
 * @author Accel Magaña Rodriguez. <accel.mr@gmail.com>
 */

/* External imports */
import Discord from "discord.js";

/** Own modules  */
import { log, error } from "../Helpers/helpers";
import { ShrekBot } from "../shrekBot";
import { getMemberByName, getChannelByName } from "../Helpers/discordHelper";

//Triggers to call this command
export const Triggers: string[] = ["m", "d", "move"];

/**
 * Summary.Command that moves or disconnect person from voice channel.
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
  //Get all members in this guild
  const Guild = _message.guild;
  const MemberManager = Guild.members;
  const Members = MemberManager.cache;
  const AuthorName = _message.author.username;

  //Delete this command
  _message.delete();

  if (typeof _args[0] === "undefined") {
    return error("No srgs sent");
  }

  //Parse args
  const MemberNick = _args[0].toLowerCase();
  const ChannelName = typeof _args[1] === "undefined" ? "" : _args[1].toLowerCase();

  //Look for that member
  let Member = getMemberByName(MemberNick, _client, Members);
  if (!Member) return;

  //Check if member is connected to any voice channel
  let VoiceConnection = Member.voice;
  if (!VoiceConnection) return error("Player is not connected to any channel.");

  /**
   * Look for channel, it doens't matter if channel = null, that only means that the person is
   * going to be disconnected
   * */
  let ChannelToMove = getChannelByName(ChannelName, Guild);

  //Actual command
  VoiceConnection.setChannel(ChannelToMove);

  let moveDisconect = ChannelToMove === null ? "disconnected" : "moved to ";
  log(`${AuthorName} has ${moveDisconect} ${Member.user.username}${ChannelName}`);
}
