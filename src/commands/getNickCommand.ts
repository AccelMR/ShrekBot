/**
 * @Description Get command file.
 *
 * @author Accel Magaña Rodriguez. <accel.mr@gmail.com>
 */

/* External imports */
import Discord, { TextChannel, User } from "discord.js";
import { BaseCommand, ParameterDetails } from "../Helpers/baseCommand";
import { checkParamLenght, getMemberByUserOrNickName } from "../Helpers/discordHelper";

/** Own modules  */
import { ShrekBot } from "../shrekBot";

/**
 * Reload resoruces command.
 */
export class GetNickCommand implements BaseCommand
{

  /**
   * Descriptor members.
   */
  Triggers: string[] = [`getnick`, `nicks`];
  Summary: string = `Returns in a message all the nicks attached to the given client.`;
  Description: string = `Searches in the Nick.json for a specific user and its nicknames. Returns all the nicks.`;
  Params: ParameterDetails[] = [
    {
        Name: "UserID",
        Type: "string",
        Optional: false,
        Default: "N/A",
        Description: "The UserID of the user that you want their nicks. You can get this by right clicking on a user and then 'Copi ID'."
    }
  ];
  Example: string = ' getnick 000000 | nicks 123456';

  /**
   * The actual execution of the command.
   * @param _client The actual shrekBot.
   * @param _message message command.
   * @param _args Parameters
   * @returns void
   */
  run(_client: ShrekBot, _message: Discord.Message<boolean>, _args: string[])
  {
    const Guild = _message.guild;
    if (!Guild) { return; }
    const GuildID = Guild.id;
    const ResourceMngr = _client.ResMng;    const UserName = _message.member?.user.username ?? "";
    const TexChannel = _message.channel;
    
    //Check if arguments are correct.
    if (!checkParamLenght(_args, this.Params))
    {
        const Parameters = _args.join(`, `);
        _client.errorIntoGuildFile(GuildID, `Invoker: ${UserName}. Missing arguments in ${this.Triggers[0]}(). Params: [${Parameters}]`);
        return;
    }
    
    
    //Delete this command
    _message.delete();
    
    const UserID = _args[0];
    const NicksData = ResourceMngr.getJSON("nicks");    
    const Member = getMemberByUserOrNickName(UserID, Guild, _client);
    if(!Member)
    {
        _client.errorIntoGuildFile(GuildID, `Could not find any member. Invoker was ${_message.author.username}`);
        return;
    }
    const EmbededMessage = new Discord.MessageEmbed();
    const Nicks = []
    const DiscordUserName = Member.user.username;

    EmbededMessage.setTitle(`${DiscordUserName} AKA:`);
    for(const nick in NicksData)
    {
        const CurrentUserID = NicksData[nick];
        if(CurrentUserID === Member.id)
        {
            Nicks.push(nick);
        }
    }

    if(Nicks.length === 0) {
        EmbededMessage.addField(`List: `,  `${DiscordUserName} has no nicknames :C`);
    }
    else {
        EmbededMessage.addField(`List: `,  Nicks.join('\n'));
    }

    TexChannel.send({ embeds: [EmbededMessage] });    
  }
}

/**
 * Creates a NickCommand since it can't be created outside after importing.
 * @returns AdNickCommand reference
 */
 export function createCommand(): BaseCommand
 {
   return new GetNickCommand();
 }