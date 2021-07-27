/**
 * @Description Random disconnect command.
 *
 * @author Accel Magaña Rodriguez. <accel.mr@gmail.com>
 */

/* External imports */
import Discord, { TextChannel } from "discord.js";

/** Own modules  */
import { log } from "../Helpers/helpers";
import { ShrekBot } from "../shrekBot";
import { ResourceManager } from "../resourceManager";

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
export function run(_client: ShrekBot, _message: Discord.Message, _args: string[]) {
  const resourceManager = ResourceManager.Instance;
  //Get username of the one who calle this command
  const userName = _message.author.username;
  const textCannel: TextChannel = _message.channel as TextChannel;
  const member = _message.member;
  const Guild = _message.guild;
  const user = _message.member?.user;

  const guiltyVoiceChannel = member?.voice.channel;

  if (!guiltyVoiceChannel) {
    return textCannel.send(`${user} ni siquiera estás conectado, cawn!`);
  }

  const discData = resourceManager.getJSON("discWhitelist");
  const connectedMembers = guiltyVoiceChannel.members;
  let realMembers = connectedMembers;

  if ("whitelist" in discData) {
    realMembers = connectedMembers.filter(
      (member) => !discData.whitelist.includes(member.user.username)
    );
  }

  const toDisconnect = realMembers.random();
  const victimChannel = toDisconnect.voice;
  if (!victimChannel) {
    return log("For any reason the voice channel was null.");
  }

  victimChannel.setChannel(null);

  log(`${userName} has randomly disconnected ${toDisconnect.user.username}`);

  //Delete this command
  _message.delete();
}
