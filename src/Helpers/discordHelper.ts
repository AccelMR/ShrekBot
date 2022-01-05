/** External Modules */
import
{
  Collection,
  Guild,
  GuildMember,
  Snowflake,
  GuildChannel,
  ThreadChannel
} from "discord.js";

/** Own Modules */
import { ShrekBot } from "../shrekBot";
import { getVoiceConnection, createAudioResource } from "@discordjs/voice";
import { createReadStream, lstatSync } from "fs";

/**
 * Summary. Find a member with given name/nick.
 *
 * Description. This function uses Nickdata from nicks.json to look for the real username
 *             If there's no nicks then it'll look in guild member for the given name.
 *             If at the end any member is found then it'll return null
 *
 * @access  public
 *
 * @param {string}   nick or real name of the member to look for.
 *
 * @param {shrekBot}   client wrapper to get nick data.
 *
 * @return {GuildMember} Guild member found by name. Null of no member was find
 */
export function getMemberByUserOrNickName(
  _usrOrNickName: string,
  _guild: Guild,
  _client: ShrekBot | undefined
  //_members: Collection<Snowflake, GuildMember>
): GuildMember | undefined
{
  const Members = _guild.members.cache;
  let Member: GuildMember | undefined = undefined;

  if (!_client)
  {
    Member = Members.find(
      (member) => member.user.username.toLowerCase() === _usrOrNickName.toLowerCase()
    );
    return Member;
  }

  const resourceManager = _client.ResMng;
  const NicksData: Record<string, any> = resourceManager.getJSON("nicks");

  let MemberRealName: string = "";
  if (NicksData)
  {
    /**
     * Try to find real username by nick, if it does not find it, could be that
     * name sent is actually the real name, so it'll look for it in the nick values
     * if it could not be find then returns from this func
     */
    if (_usrOrNickName in NicksData)
    {
      //Get real name and then looks for the actual memeber with realName
      MemberRealName = NicksData[_usrOrNickName];
    }
    else
    {
      const Values = Object.values(NicksData);
      if (_usrOrNickName in Values)
      {
        MemberRealName = Object.keys(NicksData)[Object.values(NicksData).indexOf(_usrOrNickName)];
      }
    }
  }

  MemberRealName = MemberRealName === "" ? _usrOrNickName : MemberRealName;
  Member = Members.find(
    (member) => member.user.username.toLowerCase() === MemberRealName.toLowerCase()
  );

  return Member;
}

/**
 * Summary. Get any channel by its name inside a given guild.
 * Returns null if no channel is found
 *
 * @access  public
 *
 * @param {string}   name of the channel to look for.
 *
 * @param {Guild}   Guild where the channel is.
 *
 * @return {GuildChannel | ThreadChannel | undefined} Channel if found undefined if not.
 */
export function getChannelByName(
  _channelName: string,
  _guild: Guild
): GuildChannel | ThreadChannel | undefined
{
  //Find Channel by name, if no Channel is found or no channel was send then it'll return null
  let FoundChannel: GuildChannel | ThreadChannel | undefined;

  if (_channelName !== "")
  {
    let GuildChannelManager = _guild.channels;
    FoundChannel = GuildChannelManager.cache.find(
      (Channel) => Channel.name.toLowerCase() === _channelName
    );
    if (FoundChannel === undefined)
    {
      FoundChannel = undefined;
    }
  }

  return FoundChannel;
}



export function playSound(
  _client: ShrekBot,
  _soundPath: string,
  _guildID: string)
{
 

  const AudioConnection = getVoiceConnection(_guildID);
  if (!AudioConnection)
  {
    _client.errorIntoGuildFile(_guildID, `playSound() was called but there is no VoiceConnection in Guild ${_guildID}`);
    return;
  }

  const Stats = lstatSync(_soundPath);
  if (!Stats.isFile())
  {
    _client.errorIntoGuildFile(_guildID, `The provided path "${_soundPath}" does not exist.`);
    return;
  }

  const AudioStream = createReadStream(_soundPath);
  const AudioResource = createAudioResource(AudioStream);

  const Player = _client.getPlayer(_guildID);

  _client.logIntoGuildFile(_guildID, `Playing sound from "${_soundPath}"`);

  Player?.play(AudioResource);
}
