

export const log = (_message) => {
  console.log(_getFormatTime() + " ", _message);
}

export const error = (_message) => {
  console.error(_getFormatTime() + " ", _message);
}

export const _getFormatTime = () => {
  let date_ob = new Date();
  // current date
  // adjust 0 before single digit date
  let day = ("0" + date_ob.getDate()).slice(-2);

  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  // current year
  let year = date_ob.getFullYear();

  // current hours
  let hours = date_ob.getHours();

  // current minutes
  let minutes = date_ob.getMinutes();

  // current seconds
  let seconds = date_ob.getSeconds();

  return "[" + day + "-" + month + "-" + year + "_" + hours + ":" + minutes + "]";
}

// Checks if string can be converted to int if Nan is found then it'll return 
// a default value. Default = 0
export const _getInteger = (_stringVal, _default = 0) => {
  let intValue = parseInt(_stringVal);
  return isNaN(intValue) ? _default : intValue;
}


/* *********************************************************************** */
/*                              Discord Helpers                            
/* *********************************************************************** */

/**
 * Summary. Find a member with given name/nick.
 * 
 * Desciption. This function uses Nickdata from nicks.json to loock for the real username
 *             If there's no nicks then it'll look in guiold member for the given name.
 *             If at the end any member is found then it'll return null
 *
 * @access  public
 *
 * @param {string}   nick or real name of the member to look for.
 *
 * @param {shreckBot}   client wrapper to get nick data.
 * 
 * @return {Guildmember} Guild member found by name. Null of no member was find
 */
export const getMemberByName = (_name, _client, _members) => {
  let NicksData = _client.getJSON("nicks");
  let MemberRealName = "";
  let Member = null;

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
    }
    else {
      let Values = Object.values(NicksData);
      if (_name in Values) {
        MemberRealName = Object.keys(NicksData)[Object.values(NicksData).indexOf(_name)];
      }
    }
  }

  MemberRealName = MemberRealName === "" ? _name : MemberRealName;
  Member = _members.find(member => member.user.username.toLowerCase() === MemberRealName.toLowerCase());
  if (!Member) { error("Member couldn't be find."); }

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
export const getChannelByName = (_channelName, _guild) => {

  //Find Channel by name, if no Channel is found or no channel was send then it'll return null
  let ChannelToMove = null;

  if (_channelName !== "") {
    let GuildChannelManager = _guild.channels;
    ChannelToMove = GuildChannelManager.cache.find(Channel => Channel.name.toLowerCase() === _channelName);
    if (ChannelToMove === undefined) { ChannelToMove = null; }
  }

  return ChannelToMove;
}