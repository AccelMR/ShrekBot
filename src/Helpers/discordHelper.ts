/** External Modules */
import
{
  Guild,
  GuildMember,
  GuildChannel,
  ThreadChannel
} from "discord.js";
import { getVoiceConnection, createAudioResource } from "@discordjs/voice";

/** Own Modules */
import { ShrekBot } from "../shrekBot";
import { createReadStream, lstatSync } from "fs";
import { ParameterDetails } from "./baseCommand";

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
  _UsrNickOrID: string,
  _guild: Guild,
  _client: ShrekBot | undefined
  //_members: Collection<Snowflake, GuildMember>
): GuildMember | undefined
{
  const Members = _guild.members.cache;
  let Member: GuildMember | undefined = undefined;
  const FixedUserOrNick = _UsrNickOrID.toLocaleLowerCase();
  

  if (!_client)
  {
    //If no client it means there isn't a Nick DB so we look for the name as username or as id.
    return Members.find(
      (member) => member.user.username.toLowerCase() === FixedUserOrNick || member.user.id.toLowerCase() === FixedUserOrNick
    );
  }

  let MemberID: string = _UsrNickOrID;

  const NicksData: Record<string, any> = _client.ResMng.getJSON("nicks");
  if (NicksData && MemberID in NicksData)
  {
    MemberID = NicksData[_UsrNickOrID];
  }

  return Member = Members.find(
    (member) => member.user.id === MemberID
  );
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

/**
 * 
 * @param _client Shrek bot reference.  
 * @param _soundPath Complete path to the mp3 sound.
 * @param _guildID Guild ID where is going to be played.
 * @returns {boolean} If the sound could be played
 */
export function playSoundFromFile(
  _client: ShrekBot,
  _soundPath: string,
  _guildID: string)
{


  const AudioConnection = getVoiceConnection(_guildID);
  if (!AudioConnection)
  {
    _client.errorIntoGuildFile(_guildID, `playSoundFromFile() was called but there is no VoiceConnection in Guild ${_guildID}`);
    return false;
  }

  const Stats = lstatSync(_soundPath);
  if (!Stats.isFile())
  {
    _client.errorIntoGuildFile(_guildID, `The provided path "${_soundPath}" does not exist.`);
    return false;
  }

  const AudioStream = createReadStream(_soundPath);
  const AudioResource = createAudioResource(AudioStream);

  const Player = _client.getPlayer(_guildID);

  _client.logIntoGuildFile(_guildID, `Playing sound from "${_soundPath}"`);

  Player?.play(AudioResource);
  return true;
}

/**
 * Checks the lenght of the args and the mandatory parameters in ParamDetails, if they match true is returned.
 * 
 * @param _args Arguments got in the run command.
 * @param _paramDetails Param details of the command.
 * @returns {boolean} true if Arguments are correct.
 */
export function checkParamLenght(_args: string[], _paramDetails: ParameterDetails[]): boolean
{
  let NumMandatoryParams: number = 0;
  for (const Param of _paramDetails)
  {
    if (!Param.Optional)
    {
      NumMandatoryParams++;
    }
  }
  return _args.length >= NumMandatoryParams;
}
