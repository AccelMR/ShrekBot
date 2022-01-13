/**
 * @Description Help command.
 *
 * @author Accel Magaña Rodriguez. <accel.mr@gmail.com>
 */

/* External imports */
import Discord, { Collection, MessageEmbed, TextChannel } from "discord.js";
import { BaseCommand, ParameterDetails } from "../Helpers/baseCommand";

/** Own modules  */
import { ShrekBot } from "../shrekBot";

/**
 * Help command.
 */
export class HelpCommand implements BaseCommand
{
    /**
     * Descriptor members.
     */
    Triggers: string[] = ["help", "h"];
    Summary: string = "Help command, summary of all commands.";
    Description: string = `Help command, summary of all commands or if yous send a command you can get much more information about the command and its parameters.`;
    Params: ParameterDetails[] =
        [
            {
                Name: "Command Name",
                Type: "string",
                Optional: true,
                Default: "N/A",
                Description: "The full name of the command that you want more information. e.g./ .help help"
            }
        ];
    Example: string = 'help  | .help help';

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
        const TextChannel = _message.channel;
        const UserName = _message.member?.user.username ?? "";

        //Delete this command
        _message.delete();

        let EmbededMessage = new Discord.MessageEmbed();

        const Commands = _client.Commands;
        if (_args.length === 0)
        {
            EmbededMessage.setTitle(`Help Command. <Parameters>`);
            const UniqueCmds: Collection<string, BaseCommand> = new Collection();
            for (const [Key, CommandBase] of Commands.entries())
            {
                const Params = CommandBase.Params;
                const Aliases = CommandBase.Triggers.join(", ");
                if (Aliases in UniqueCmds)
                {
                    continue;
                }

                UniqueCmds.set(Aliases, CommandBase);
            }

            for (const [Aliases, CommandBase] of UniqueCmds)
            {
                const Params = CommandBase.Params;                
                const ParamNames: string[] = [];
                for (const Param of Params)
                {
                    ParamNames.push(Param.Name);
                }
                EmbededMessage.addField(`[${Aliases}]\t<${ParamNames.join(" | ")}>`, CommandBase.Summary);

            }
        }
        else
        {
            const CommandName = _args[0].toLocaleLowerCase();
            const CommandBase = Commands.get(CommandName);
            if (!CommandBase)
            {
                TextChannel.send(`Mi pana ${CommandName} no existe.`);//TODO: dynamic 
                _client.errorIntoGuildFile(GuildID, `${UserName} requested info of ${CommandName} but does not exist.`);
                return;
            }

            const Aliases = CommandBase.Triggers.join(", ");

            EmbededMessage.setTitle(`Callers: [${Aliases}]`);
            EmbededMessage.setDescription(`${CommandBase.Description}`);
            EmbededMessage.addField(`Parameters`, `--------------------`);

            for (const Parameter of CommandBase.Params)
            {
                EmbededMessage.addField(`${Parameter.Name}`, `${Parameter.Description} **Type:** {${Parameter.Type}}`, true);
                EmbededMessage.addField(`Optional: ${Parameter.Optional}`, `**Value Defaut:** {${Parameter.Default}}`, true);
                EmbededMessage.addField("\u200b", "\u200b");
            }
            EmbededMessage.addField(`Example use: `, `${CommandBase.Example}`);

        }
        TextChannel.send({ embeds: [EmbededMessage] });
    }
}

/**
 * Creates Command Reference since it can't be created outside if it is dynamc.
 * @returns AdNickCommand reference
 */
export function createCommand(): BaseCommand
{
    return new HelpCommand();
}
