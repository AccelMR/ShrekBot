/**
 * @Description Move/Disconnect command.
 *
 * @author Accel Magaña Rodriguez. <accel.mr@gmail.com>
 */

/* External imports */
import Discord from "discord.js";

/** Own modules  */
import { ShrekBot } from "../shrekBot";
import { getMemberByUserOrNickName, getChannelByName, checkParamLenght } from "../Helpers/discordHelper";
import { BaseCommand, ParameterDetails } from "../Helpers/baseCommand";

/**
 * Move/Disconnect command.
 */
export class MoveDisconnctCommand implements BaseCommand
{
  /**
   * Descriptor members.
   */
  Triggers: string[] = ["move", "disc"];
  Summary: string = `Moves a User if there is any channel name, otherwise it'll disconnect the user.`;
  Description: string = `Moves a User if there is any channel name, otherwise it'll disconnect the user.`;
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
        Name: "Channel Name",
        Type: "string",
        Optional: true,
        Default: "null",
        Description: "The user name, nick, or ID of the user to be moved or disconnected."
      }
    ];
  Example: string = 'move Username "Channel Name" | disc "Nick name" ';

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
    const AuthorName = _message.member?.user.username ?? "";
    const UserName = _message.author.username;

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
    const ChannelName = (_args[1] === undefined) ? "" : _args[1].toLowerCase();

    //Look for that member
    let Member = getMemberByUserOrNickName(MemberNick, Guild, _client);
    if (!Member)
    {
      _client.errorIntoGuildFile(GuildID, `${AuthorName} tried to move -${MemberNick}- but that name was not found.`);
      return;
    }

    //Check if member is connected to any voice channel
    let VoiceConnection = Member.voice;
    if (!VoiceConnection)
    {
      _client.errorIntoGuildFile(GuildID, `${AuthorName} tried to move ${Member.user.username} but they aren't connected to any channel.`);
      return;
    }

    /**
     * Look for channel, it doesn't matter if channel = null, that only means that the person is
     * going to be disconnected
     * */
    const ChannelToMove = getChannelByName(ChannelName, Guild) as Discord.VoiceChannel;

    //Actual command
    VoiceConnection.setChannel(ChannelToMove ?? null);

    let moveDisconnect = "moved";
    let Msg = ` to ${ChannelName}`;
    if (!ChannelToMove)
    {
      moveDisconnect = "disconnected";
      Msg = "";
    }

    Msg = `${AuthorName} has ${moveDisconnect} ${Member.user.username}` + Msg;
    _client.logIntoGuildFile(GuildID, Msg);
  }

}

/**
 * Creates a NickCommand since it can't be created outside after importing.
 * @returns AdNickCommand reference
 */
export function createCommand(): BaseCommand
{
  return new MoveDisconnctCommand();
}
