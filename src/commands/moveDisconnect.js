//Own Modules
import { error, getChannelByName, log, getMemberByName } from "../Helpers.js"

export const Triggers = ['m', 'move', 'd', 'disconnect']

export const run = (_client, _message, _args) => {
  //Delete this command
  _message.delete();

  //Get all members in this guild
  let MemberManager = _message.guild.members;
  let Members = MemberManager.cache;

  //Parse args
  let MemberNick = _args[0].toLowerCase();
  let ChannelName = typeof _args[1] === 'undefined' ? "" : _args[1].toLowerCase();

  let Member = getMemberByName(MemberNick, _client, Members);
  if (!Member) return;

  //Check if member is connected to any voice channel
  let VoiceConnection = Member.voice;
  if (!VoiceConnection) return error("Player is not connected to any channel.");


  let ChannelToMove = getChannelByName(ChannelName, _message.guild);

  //Actual command
  VoiceConnection.setChannel(ChannelToMove);

  let moveDisconect = ChannelToMove === null ? "disconnected" : "moved";
  log(`${_message.author.username} has ${moveDisconect} ${Member.user.username}`);
}