/**
 * @Description Move/Disconnect command.
 *
 * @author Accel Magaña Rodriguez. <accel.mr@gmail.com>
 */

/* External imports */
import Discord from "discord.js";

/** Own modules  */
import { ShrekBot } from "../shrekBot";
import { getMemberByUserOrNickName, getChannelByName } from "../Helpers/discordHelper";

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
export function run(_client: ShrekBot, _message: Discord.Message, _args: string[])
{
  //Get all members in this guild
  const Guild = _message.guild;
  if (!Guild) return;
  const GuildID = Guild.id;
  const AuthorName = _message.member?.user.username ?? "";

  //Delete this command
  _message.delete();

  if (typeof _args[0] === "undefined")
  {
    return _client.errorIntoGuildFile(GuildID, `${AuthorName} called command move but didn't say who to move >:| .`);
  }

  //Parse args
  const MemberNick = _args[0].toLowerCase();
  const ChannelName = typeof _args[1] === "undefined" ? "" : _args[1].toLowerCase();

  //Look for that member
  let Member = getMemberByUserOrNickName(MemberNick, Guild, _client);
  if (!Member)
  {
    _client.errorIntoGuildFile(GuildID, `${AuthorName} tried to move -${MemberNick}- but that name was not found.`);
    return;
  }

  //Check if member is connected to any voice channel
  let VoiceConnection = Member.voice;
  if (!VoiceConnection)
  {
    _client.errorIntoGuildFile(GuildID, `${AuthorName} tried to move ${Member.user.username} but they aren't connected to any channel.`);
    return;

  }

  /**
   * Look for channel, it doesn't matter if channel = null, that only means that the person is
   * going to be disconnected
   * */
  const ChannelToMove = getChannelByName(ChannelName, Guild) as Discord.VoiceChannel;

  //Actual command
  const Reason = _args[2] ?? "";
  VoiceConnection.setChannel(ChannelToMove ?? null, Reason);

  let moveDisconnect = "moved";
  let Msg = ` to ${ChannelName}`;
  if(!ChannelToMove)
  {
    moveDisconnect = "disconnected";
    Msg = "";
  }

  Msg = `${AuthorName} has ${moveDisconnect} ${Member.user.username}` + Msg;
  _client.logIntoGuildFile(GuildID, Msg);
}
