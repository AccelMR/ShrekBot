/** External Modules */
import {
  Collection,
  Guild,
  GuildMember,
  Snowflake,
  GuildChannel,
  Message,
} from "discord.js";

/** Own Modules */
import { ShrekBot } from "../shrekBot";
import { error } from "./helpers";
import { ResourceManager } from "../resourceManager";

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
export function getMemberByName(
  _name: string,
  _client: ShrekBot,
  _members: Collection<Snowflake, GuildMember>
): GuildMember | undefined {
  const resourceManager = ResourceManager.Instance;
  const NicksData: Record<string, any> = resourceManager.getJSON("nicks");

  let MemberRealName: string = "";
  let Member: GuildMember | undefined = undefined;

  //TODO probably this function can be reduce and optimized
  if (NicksData) {
    /**
     * Try to find real username by nick, if it does not find it, could be that
     * name sent is actually the real name, so it'll look for it in the nick values
     * if it could not be find then returns from this func
     */
    if (_name in NicksData) {
      //Get real name and then looks for the actual memeber with realName
      MemberRealName = NicksData[_name];
    } else {
      const Values = Object.values(NicksData);
      if (_name in Values) {
        MemberRealName = Object.keys(NicksData)[Object.values(NicksData).indexOf(_name)];
      }
    }
  }

  MemberRealName = MemberRealName === "" ? _name : MemberRealName;
  Member = _members.find(
    (member) => member.user.username.toLowerCase() === MemberRealName.toLowerCase()
  );

  return Member;
}

/**
 * Summary. Get a channel by its name.
 * Returns null if no channel is found
 *
 * @access  public
 *
 * @param {string}   name of the channel to look for.
 *
 * @param {Guild}   Guild where the channel is.
 *
 * @return {GuildChannel} Channel found by given name
 */
export function getChannelByName(
  _channelName: string,
  _guild: Guild
): GuildChannel | undefined {
  //Find Channel by name, if no Channel is found or no channel was send then it'll return null
  let FoundChannel: GuildChannel | undefined;

  if (_channelName !== "") {
    let GuildChannelManager = _guild.channels;
    FoundChannel = GuildChannelManager.cache.find(
      (Channel) => Channel.name.toLowerCase() === _channelName
    );
    if (FoundChannel === undefined) {
      FoundChannel = undefined;
    }
  }

  return FoundChannel;
}
