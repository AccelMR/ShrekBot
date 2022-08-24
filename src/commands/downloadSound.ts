import { Message, TextChannel } from "discord.js";
import { BaseCommand, ParameterDetails } from "../Helpers/baseCommand";
import { downloadFromURL } from "../Helpers/helpers";
import { ShrekBot } from "../shrekBot";


/**
 * Download a sound.
 */
export class DownloadSoundCommand implements BaseCommand
{
    /**
     * Descriptor members.
     */
    Triggers: string[] = ["downloadSound", "getsound", "dsound"];
    Summary: string = `Downloads a sound in the current message. If no sound found then it does not download anything.`;
    Description: string = `Downloads a sound in the current message. If no sound found then it does not download anything.\
        Sound has to have the next attributes: 3 seconds max and mp3 extension`;
    Params: ParameterDetails[] = [
        {
            Name: "Sound",
            Type: "mp3",
            Optional: false,
            Default: "N/A",
            Description: "The actual sound attached to this message. If that attached file is not a mp3 it won't download it."
        },
        {
            Name: "UserName",
            Type: "string",
            Optional: true,
            Default: "N/A",
            Description: "If this sound will be linked to a specific user."
        }
    ];
    Example: string = 'downloadSound | getsound | dsound';

    /**
     * The actual execution of the command.
     * @param _client The actual shrekBot.
     * @param _message message command.
     * @param _args Parameters
     * @returns void
     */
    run(_client: ShrekBot, _message: Message<boolean>, _args: string[])
    {
        const Guild = _message.guild;
        if (!Guild) return;
        const GuildID = Guild.id;
        const User = _message.member?.user;
        const UserName = User?.username ?? "";
        const TexChannel = _message.channel;

        if (!_message.attachments)
        {
            _client.warningIntoGuildFile(GuildID, `Invoker: ${UserName}. There were not attachments to the meesage.`);
            TexChannel.send(`${User} Maestro, eso ni tiene un sonido.`); //TODO: dynamic
            return;
        }
        const Attachment = _message.attachments.first();
        if (!Attachment || Attachment?.contentType !== "audio/mpeg")
        {
            _client.warningIntoGuildFile(GuildID, `Invoker: ${UserName}. The attachment is not a sound.`);
            TexChannel.send(`${User} Maestro, eso no es un sonido.`); //TODO: dynamic
            return;
        }

        const AttachmentName = Attachment.name ?? "NoName.mp3";
        downloadFromURL(Attachment.url, AttachmentName, () => {
            TexChannel.send(`${AttachmentName} has been downloaded. See help addsound command if you want to use this sound.`); //TODO: dynamic

            const UsrToAdd = _args[0];
            if(UsrToAdd){
                const GuildToAdd = _args[1] ?? GuildID;
                _client.triggerCommand("addsound", _message, [UsrToAdd, AttachmentName, GuildToAdd]);
            }
        });


    }
}

export function createCommand(): BaseCommand
{
    return new DownloadSoundCommand();
}