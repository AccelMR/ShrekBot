/**
 * @Description Add nick command.
 *
 * @author Accel Magaña Rodriguez. <accel.mr@gmail.com>
 */

/* External imports */
import Discord from "discord.js";
import fs from "fs";
import { BaseCommand, ParameterDetails } from "../Helpers/baseCommand";
import { checkParamLenght } from "../Helpers/discordHelper";

/** Own modules  */
import { ShrekBot } from "../shrekBot";

/**
 * Add nick command class.
 */
export class AddNickCommand implements BaseCommand
{
  /**
   * Descriptor members.
   */
  Triggers: string[] = ["addnick"];
  Summary: string = `Adds a nick to a User.`;
  Description: string = `Adds a nick to a User. In order to get User ID, you need to activate developer mode in Discord, then right click on the user you want and 'Copy ID.'`;
  Params: ParameterDetails[] =
    [
      {
        Name: "NickName",
        Type: "string",
        Optional: false,
        Default: "N/A",
        Description: "The new nick name to be attached to the User."
      },
      {
        Name: "UserID",
        Type: "string",
        Optional: false,
        Default: "N/A",
        Description: "The UserID of the user that you want to add a nick name."
      }
    ];
  Example: string = 'addnick nickname 00000000 | addnick "nick name" 000000000';

  /**
   * The actual execution of the command.
   * @param _client The actual shrekBot.
   * @param _message message command.
   * @param _args Parameters
   * @returns void
   */
  run(_client: ShrekBot, _message: Discord.Message<boolean>, _args: string[])
  {
    const Channel = _message.channel;
    const UserName = _message.author.username;
    const ResourceMngr = _client.ResMng;
    const Guild = _message.guild;
    if (!Guild) { return; }
    const GuildID = Guild?.id;

    //Check if arguments are correct.
    if (!checkParamLenght(_args, this.Params))
    {
      const Parameters = _args.join(`, `);
      _client.errorIntoGuildFile(GuildID, `Invoker: ${UserName}. Missing arguments in ${this.Triggers[0]}(). Params: [${Parameters}]`);
      return;
    }

    //Delete this command
    _message.delete();

    let NicksData = ResourceMngr.getJSON("nicks");
    //Nicks only can be saved with lower case
    let Nick = _args[0].toLowerCase();
    let UserID = _args[1];

    const Member = Guild.members.cache.get(UserID);
    if (!Member)
    {
      _client.errorIntoGuildFile(GuildID, `${_message.member?.user.username} tried to add -${UserID}- but it does not exist in this Guild.`);
      Channel.send(`Compa, ese no es un ID valido.`); //TODO: Make dynamic
      return;
    }

    //If nick already exist then it'll return
    if (Nick in NicksData)
    {
      const ErrorMessage = `${Nick} exists already in the nicks for -${NicksData[Nick]}- ID.`;
      Channel.send(ErrorMessage);
      _client.logIntoGuildFile(GuildID, ErrorMessage);
      return;
    }

    //Adds it to the nick data and also writes it to the data file
    NicksData[Nick] = UserID;
    fs.writeFile(
      `${process.env.JSON_PATH}nicks.json`,
      JSON.stringify(NicksData),
      function writeJSON(_err)
      {
        if (_err) return console.error(_err);
      }
    );

    _client.logIntoGuildFile(GuildID, `${UserID} has new Nick ${Nick}`);
  }

}

/**
 * Creates a NickCommand since it can't be created outside after importing.
 * @returns AdNickCommand reference
 */
export function createCommand(): BaseCommand
{
  return new AddNickCommand();
}