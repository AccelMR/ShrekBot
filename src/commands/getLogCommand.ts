/* External imports */
import Discord from "discord.js";
import * as fs from "fs";
import { BaseCommand, ParameterDetails } from "../Helpers/baseCommand";

/** Own modules  */
import { ShrekBot } from "../shrekBot";

/**
 * Get logs command.
 */
export class GetLogCommand implements BaseCommand
{
    /**
     * Descriptor members.
     */
    Triggers: string[] = ["getlog", "blame"];
    Summary: string = "Sends a message with the last N logged lines.";
    Description: string = "Sends a message with the last N logged lines. Note that Shrek bot has a lot of logs, so probably you'll need more lines that you think.";
    Params: ParameterDetails[] =
        [
            {
                Name: "Number of Logs to Get",
                Type: "number",
                Optional: true,
                Default: "5",
                Description: "Number of lines to take in the log."
            }
        ];
    Example: string = 'getlog | .getlog 5';

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
        const UserName = _message.member?.user.username;

        _message.delete();

        _client.forceSaveLoggers();

        const Logger = _client.getLogger(GuildID);
        if (!Logger)
        {
            _client.errorIntoGuildFile(GuildID, `Could not find logger for ${Guild.name}`);
            return;
        }

        let LinesToRetrieve: number = _args?.length === 0 ? 1 : +_args[0];
        if(LinesToRetrieve >= 100 ){
            LinesToRetrieve = 99;
        }

        const Logs =  Logger.getLastLogs(LinesToRetrieve);
        // if (!fs.existsSync(Logger.LoggerPath))
        // {
        //     _client.errorIntoGuildFile(GuildID, `-${Logger.LoggerPath}- is not a good path.`);
        //     return;
        // }

        // //Get the whole buffer
        // const Buffer = fs.readFileSync(Logger.LoggerPath);
        // //TRanslate it to a string and replace enters.
        // const BufferString = Buffer.toString();
        // //Split into array
        // const BufferArray = BufferString.split('\n');

        let Message = "```";
        // let Pos = BufferArray.length - LinesToRetrieve - 1;
        // if (Pos <= 0) Pos = 0;

        // for (let i = Pos; i < Pos + LinesToRetrieve; i++)
        // {
        //     const Line = BufferArray[i];
        //     if (!Line) { break; }
        //     Message += `${Line}\n`;
        // }
        // Message += "\n```";

        for (const line of Logs) {
            Message += `${line}`;
        }

        const Channel = _message.channel;
        Channel.send(Message);
        _client.logIntoGuildFile(GuildID, `${UserName} requested log for ${LinesToRetrieve} lines.`);
    }
}

/**
 * Creates Command Reference since it can't be created outside if it is dynamc.
 * @returns AdNickCommand reference
 */
export function createCommand(): BaseCommand
{
    return new GetLogCommand();
}