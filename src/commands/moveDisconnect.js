//Own Modules
import { error, getChannelByName, log, getMemberByName } from "../Helpers.js"

export const Triggers = ['m', 'move', 'd', 'disconnect']

export const run = (_client, _message, _args) => {
  //Get all members in this guild
  const Guild = _message.guild;
  const MemberManager = Guild.members;
  const Members = MemberManager.cache;
  const AuthorName = _message.author.username;

  //Delete this command
  _message.delete();

  if (typeof _args[0] === 'undefined') { return error("No srgs sent"); }
  
  //Parse args
  const MemberNick = _args[0].toLowerCase();
  const ChannelName = typeof _args[1] === 'undefined' ? "" : _args[1].toLowerCase();

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

  let moveDisconect = ChannelToMove === null ? "disconnected" : "moved";
  log(`${AuthorName} has ${moveDisconect} ${Member.user.username} to ${ChannelName}`);
}