/**
 * @Description Join command.
 *
 * @author Accel Magaña Rodriguez. <accel.mr@gmail.com>
 */

/* External imports */
import Discord from "discord.js";
import { createAudioPlayer, joinVoiceChannel } from "@discordjs/voice";
import { getChannelByName } from "../Helpers/discordHelper";

/** Own modules  */

import { ShrekBot } from "../shrekBot";

//Triggers to call this command
export const Triggers: string[] = ["join"];

/**
 * Summary.Command to make the bot connect to a certain voice channel.
 *W
 * @access  public
 *
 * @param {ShrekBot}   Bot Own reference of Shrek bot.
 *
 * @param {Discord.Message}   Message Discord message.
 *
 * @param {Array}   Array of arguments.
 *
 * @return {void}
 */

export function run(_client: ShrekBot, _message: Discord.Message, _args: string[])
{
 
  //Get username of the one who calle this command
  const userName = _message.author.username;
  const member = _message.member;
  const Guild = _message.guild;
  if (!Guild) return console.error("Guild Id undefined in Join command");
  const GuildID = Guild.id;

  let voiceChannel = member?.voice.channel;

  if (_args.length > 0)
  {
    voiceChannel = getChannelByName(_args[0], Guild) as Discord.VoiceChannel;
  }

  //Delete this command
  _message.delete();

  if (!voiceChannel) return _client.logIntoGuildFile(GuildID, `No voice channel found for ${userName}`);

  const VoiceChannelID = voiceChannel.id;
  if (!VoiceChannelID || !GuildID) { return; }

  const Connection = joinVoiceChannel({
    channelId: VoiceChannelID,
    guildId: GuildID,
    adapterCreator: Guild.voiceAdapterCreator
  });

  //Register this player
  const Player = createAudioPlayer();
  _client.addPlayer(GuildID, Player);

  Connection.subscribe(Player);

  _client.logIntoGuildFile(GuildID, `Created Player for "${Guild.name}" in join command.`);

}
