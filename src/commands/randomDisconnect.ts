/**
 * @Description Random disconnect command.
 *
 * @author Accel Magaña Rodriguez. <accel.mr@gmail.com>
 */

/* External imports */
import Discord, { TextChannel } from "discord.js";

/** Own modules  */
import { ShrekBot } from "../shrekBot";

//Triggers to call this command
export const Triggers: string[] = ["rd"];

/**
 * Summary.Random disconnects someone in a voice Channel.
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
  const resourceManager = _client.ResMng;
  //Get username of the one who calle this command
  const userName = _message.author.username;
  const textCannel: TextChannel = _message.channel as TextChannel;
  const member = _message.member;
  const Guild = _message.guild;
  if (!Guild) { return; }
  const GuildID = Guild.id;
  const user = _message.member?.user;

  const guiltyVoiceChannel = member?.voice.channel;

  if (!guiltyVoiceChannel)
  {
    return textCannel.send(`${user} ni siquiera estás conectado, cawn!`);
  }

  const discData = resourceManager.getJSON("whitelist");
  const connectedMembers = guiltyVoiceChannel.members;
  let realMembers = connectedMembers;

  if ("randomDisconnect" in discData)
  {
    realMembers = connectedMembers.filter(
      (member) => !discData.randomDisconnect.includes(member.user.id)
    );
  }

  const toDisconnect = realMembers.random();
  const victimChannel = toDisconnect?.voice;
  if (!victimChannel)
  {
    _client.logIntoGuildFile(GuildID, "For any reason the voice channel was null.");
    return;
  }

  victimChannel.setChannel(null);

  _client.logIntoGuildFile(GuildID, `${userName} has randomly disconnected ${toDisconnect.user.username}`);

  //Delete this command
  _message.delete();
}
