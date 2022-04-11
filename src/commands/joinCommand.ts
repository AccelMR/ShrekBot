/**
 * @Description Join command.
 *
 * @author Accel Magaña Rodriguez. <accel.mr@gmail.com>
 */

/* External imports */
import Discord from "discord.js";
import { createAudioPlayer, DiscordGatewayAdapterCreator, joinVoiceChannel } from "@discordjs/voice";
import { checkParamLenght, getChannelByName } from "../Helpers/discordHelper";

/** Own modules  */

import { ShrekBot } from "../shrekBot";
import { BaseCommand, ParameterDetails } from "../Helpers/baseCommand";

/**
 * Join/Connect command.
 */
export class JoinCommand implements BaseCommand
{
  /**
   * Descriptor members.
   */
  Triggers: string[] = ["join", "connect"];
  Summary: string = "Connects the Shrek Bot to the same member voice channel or to a given channel";
  Description: string = "Connects the Shrek Bot to the same member voice channel. You can send a channel name.\
   If null is send and the member who invoked the command is not connected, then Shrek Bot can't connect to any channel.";
  Params: ParameterDetails[] =
    [
      {
        Name: "Voice Channel Name",
        Type: "string",
        Optional: true,
        Default: "Invoker Member Voice Channel",
        Description: `The name of the channel where you want the bot connected. If that channel has spaces send it between { " } `
      }
    ];
  Example: string = `.join | ".join Channel Name"`;

  /**
   * The actual execution of the command.
   * @param _client The actual shrekBot.
   * @param _message message command.
   * @param _args Parameters
   * @returns void
   */
  run(_client: ShrekBot, _message: Discord.Message<boolean>, _args: string[])
  {
    //Get username of the one who calle this command
    const userName = _message.author.username;
    const member = _message.member;
    const Guild = _message.guild;
    if (!Guild) return console.error("Guild Id undefined in Join command");
    const GuildID = Guild.id;

    //Check if arguments are correct.
    if (!checkParamLenght(_args, this.Params))
    {
      const Parameters = _args.join(`, `);
      _client.errorIntoGuildFile(GuildID, `Invoker: ${userName}. Missing arguments in ${this.Triggers[0]}(). Params: [${Parameters}]`);
      return;
    }

    let voiceChannel = getChannelByName(_args[0], Guild) as Discord.VoiceChannel ?? member?.voice.channel;

    //Delete this command
    _message.delete();

    if (!voiceChannel) return _client.logIntoGuildFile(GuildID, `No voice channel found for ${userName}`);

    const VoiceChannelID = voiceChannel.id;
    if (!VoiceChannelID || !GuildID) { return; }

    const Connection = joinVoiceChannel({
      channelId: VoiceChannelID,
      guildId: GuildID,
      adapterCreator: Guild.voiceAdapterCreator as DiscordGatewayAdapterCreator
    });

    //Register this player
    const Player = createAudioPlayer();
    _client.addPlayer(GuildID, Player);

    Connection.subscribe(Player);

    _client.logIntoGuildFile(GuildID, `Created Player for "${Guild.name}" in join command.`);
  }
}

/**
 * Creates Command Reference since it can't be created outside if it is dynamc.
 * @returns AdNickCommand reference
 */
export function createCommand(): BaseCommand
{
    return new JoinCommand();
}
