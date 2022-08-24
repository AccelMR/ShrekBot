/**
 * @Description Disconnect command.
 *
 * @author Accel Magaña Rodriguez. <accel.mr@gmail.com>
 */

/* External imports */
import Discord, { VoiceState } from "discord.js";

/** Own modules  */
import { ShrekBot } from "../shrekBot";
import { getMemberByUserOrNickName, getChannelByName, checkParamLenght } from "../Helpers/discordHelper";
import { BaseCommand, ParameterDetails } from "../Helpers/baseCommand";
import { getDateFormat, getDateTimeFormat, getTimeFormat } from "../Helpers/helpers";
import { assert } from "console";

/**
 * Move/Disconnect command.
 */
export class DisconnectCommand implements BaseCommand
{
  /**
   * Descriptor members.
   */
  Triggers: string[] = ["saca", "kill"];
  Summary: string = `Disconects a user from a voice channel.`;
  Description: string = `Disconects a user from a voice channel. You can also send a counter to disconnect the user after its done, the counter is un seconds.`;
  Params: ParameterDetails[] =
    [
      {
        Name: "User Name To Disconnect",
        Type: "string",
        Optional: false,
        Default: "N/A",
        Description: "The user name, nick, or ID of the user to be moved or disconnected."
      },
      {
        Name: "Time",
        Type: "string",
        Optional: false,
        Default: "N/A",
        Description: "Time in seconds to disconnect."
      }
    ];
  Example: string = 'saca Username| ';

  /**
   * The actual execution of the command.
   * @param _client The actual shrekBot.
   * @param _message message command.
   * @param _args Parameters
   * @returns void
   */
  run(_client: ShrekBot, _message: Discord.Message<boolean>, _args: string[])
  {
    //Get all members in this guild
    const Guild = _message.guild;
    if (!Guild) return;
    const GuildID = Guild.id;
    const AuthorMember = _message.member?.user.id;
    if (!AuthorMember){return;}
    const AuthorName = _message.member?.user.username ?? "";
    const UserName = _message.author.username;
    const CurrentTextChannel = _message.channel;

    //Check if arguments are correct.
    if (!checkParamLenght(_args, this.Params))
    {
      const Parameters = _args.join(`, `);
      _client.errorIntoGuildFile(GuildID, `Invoker: ${UserName}. Missing arguments in ${this.Triggers[0]}(). Params: [${Parameters}]`);
      return;
    }

    //Delete this command
    _message.delete();

    //Parse args
    const MemberNick = _args[0];
    const Time = +_args[1];

    //Look for that member
    let Member = getMemberByUserOrNickName(MemberNick, Guild, _client);
    if (!Member)
    {
      _client.errorIntoGuildFile(GuildID, `${AuthorName} tried to move -${MemberNick}- but that name was not found.`);
      return;
    }
    const MemberID = Member.user.id;

    //Check if member is connected to any voice channel
    let VoiceConnection = Member.voice;
    if (!VoiceConnection)
    {
      _client.errorIntoGuildFile(GuildID, `${AuthorName} tried to move ${Member.user.username} but they aren't connected to any channel.`);
      return;
    }

    const DisconnectUser = (date: string, time:string) => {
        //Actual command
        VoiceConnection.setChannel( null );
        _client.logIntoGuildFile(GuildID, `${UserName} disconnected ${MemberID} in ${Time} seconds.`);

        CurrentTextChannel.send(`<@${MemberID}> te mandaron a bailar el ${date} a las ${time}.\n Atte: <@${AuthorMember}>`);
    }; 
    
    const TO_MILLISEC = 1000;
    setTimeout(DisconnectUser, Time * TO_MILLISEC, getDateFormat(), getTimeFormat());

    CurrentTextChannel.send(`<@${MemberID}> :eyes:`)    
  }

}

/**
 * Creates a NickCommand since it can't be created outside after importing.
 * @returns AdNickCommand reference
 */
export function createCommand(): BaseCommand
{
  return new DisconnectCommand();
}
