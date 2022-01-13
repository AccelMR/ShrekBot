/**
 * @Description Random disconnect command.
 *
 * @author Accel Magaña Rodriguez. <accel.mr@gmail.com>
 */

/* External imports */
import Discord, { TextChannel } from "discord.js";
import { BaseCommand, ParameterDetails } from "../Helpers/baseCommand";

/** Own modules  */
import { ShrekBot } from "../shrekBot";

/**
 * Random disconnect command.
 */
export class RondomDisconnectCommand implements BaseCommand
{
  /**
   * Descriptor members.
   */
  Triggers: string[] = ["rd"];
  Summary: string = `Randomly disconnects someone from the same channel that the invoker.`;
  Description: string = `Randomly disconnects someone from the same channel that the invoker. If the invoker is not\
  connected Shrek Bot will send a message to the invoker.`;
  Params: ParameterDetails[] = [];
  Example: string = `rd`;

  /**
   * The actual execution of the command.
   * @param _client The actual shrekBot.
   * @param _message message command.
   * @param _args Parameters
   * @returns void
   */
  run(_client: ShrekBot, _message: Discord.Message<boolean>, _args: string[])
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
}

/**
 * Creates a NickCommand since it can't be created outside after importing.
 * @returns AdNickCommand reference
 */
export function createCommand(): BaseCommand
{
  return new RondomDisconnectCommand();
}