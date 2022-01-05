/* External imports */
import Discord from "discord.js";
import * as fs from "fs";

/** Own modules  */
import { ShrekBot } from "../shrekBot";

export const Triggers: string[] = ["getLog"];

export function run(_client: ShrekBot, _message: Discord.Message, _args: string[])
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

    const LinesToRetrieve: number = _args?.length === 0 ? 1 : +_args[0];

    if (!fs.existsSync(Logger.LoggerPath))
    {
        _client.errorIntoGuildFile(GuildID, `-${Logger.LoggerPath}- is not a good path.`);
        return;
    }

    //Get the whole buffer
    const Buffer = fs.readFileSync(Logger.LoggerPath);
    //TRanslate it to a string and replace enters.
    const BufferString = Buffer.toString();
    //Split into array
    const BufferArray = BufferString.split('\n');

    let Message = "```";
    let Pos = BufferArray.length - LinesToRetrieve;
    if (Pos <= 0) Pos = 0;

    for (let i = Pos; i < LinesToRetrieve; i++)
    {
        const Line = BufferArray[i];
        if (!Line) { break; }
        Message += `${Line}\n`;
    }
    Message += "\n```";

    const Channel = _message.channel;
    Channel.send(Message);
    _client.logIntoGuildFile(GuildID, `${UserName} requested log for ${LinesToRetrieve} lines.`);

}