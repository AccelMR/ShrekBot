//Own Modules
import { error, log } from "../Helpers.js"

export const Triggers = ['m', 'move', 'd', 'disconnect']

export const run = (_client, _message, _args) => {
  //Delete this command
  _message.delete();

  //Get all members in this guild
  let MemberManager = _message.guild.members;
  let Members = MemberManager.cache;

  //Parse args
  let NicksData = _client.getJSON("nicks");
  let MemberNick = _args[0].toLowerCase();
  let ChannelName = typeof _args[1] === 'undefined' ? "" : _args[1].toLowerCase();
  let MemberRealName = "";


  /**
   * Try to find real username by nick, if it does not find it, could be that 
   * name sent is actually the real name, so it'll look for it in the nick values
   * if it could not be find then returns from this func 
   */
  if (!(MemberNick in NicksData)) {
    let Values = Object.values(NicksData);
    if (!(MemberNick in Values)) return error("Member couldn't be find.");
    MemberRealName = Object.keys(NicksData)[Object.values(NicksData).indexOf(MemberNick)];
  }

  //Get real name and then looks for the actual memeber with realName
  MemberRealName = NicksData[MemberNick];
  let Member = Members.find(member => member.user.username === MemberRealName);
  if (!Member) return error("Member couldn't be find.");

  //Check if member is connected to any voice channel
  let VoiceConnection = Member.voice;
  if (!VoiceConnection) return error("Player is not connected to any channel.");

  //Find Channel by name, if no Channel is found or no channel was send then it'll act as disconnect command
  let ChannelToMove = null;
  if (ChannelName !== "") {
    let GuildChannelManager = _message.guild.channels;
    ChannelToMove = GuildChannelManager.cache.find(Channel => Channel.name.toLowerCase() === ChannelName);
    if (ChannelToMove === undefined) { ChannelToMove = null; }
  }

  //Actual command
  VoiceConnection.setChannel(ChannelToMove);

  let moveDisconect = ChannelToMove === null ? "disconnected" : "moved";
  log(`${_message.author.username} has ${moveDisconect} ${MemberRealName}`);
}