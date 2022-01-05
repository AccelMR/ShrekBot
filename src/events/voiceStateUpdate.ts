/**
 * @Description Event caller.
 *
 * @author Accel Magaña Rodriguez. <accel.mr@gmail.com>
 */

/* External imports */
import Discord, { BaseGuildVoiceChannel } from "discord.js";

/** Own Modules */
import { ShrekBot } from "../shrekBot";
import { createAudioPlayer, getVoiceConnection, joinVoiceChannel, VoiceConnection } from "@discordjs/voice";
import { playSound } from "../Helpers/discordHelper";
/**
 * Summary. Event when voice State changes.
 *
 * @access  public
 *
 * @param {ShrekBot}              Bot Own reference of Shrek Bot.
 *
 * @param {Discord.VoiceState}   _old The old state of voice.
 *
 * @param {Discord.VoiceState}   _new The new state of voice.
 *
 * @return {void}
 */
export function event(
  _client: ShrekBot,
  _old: Discord.VoiceState,
  _new: Discord.VoiceState
)
{
  const Guild = _new.guild;
  const GuildID = Guild.id;

  if (!checkStates(_new, _old)) { return; }

  //No case to continue if the user just disconnected or did another action that's not just connect
  if (!_new.channel)
  {
    _client.logIntoGuildFile(GuildID, `${_old.member?.user.username} just disconnected ${_old.channel?.name}`);
    return;
  }

  const Bot = _client.Bot;
  if (!Bot || !Bot.user)
  {
    _client.errorIntoGuildFile(GuildID, "Bot is null in voiceStateUpdate event.");
    return;
  }

  const BotID = Bot.user.id;
  const BotVoiceAdapter = _new.guild.voiceAdapterCreator;
  const UserID = _new.member?.user.id;

  if (!UserID) 
  {
    _client.errorIntoGuildFile(GuildID, `Could not find a user ID for "${_new.member?.user.username}"`);
    return;
  }

  //Check Voice State movement
  if (!_old.channel)
  {
    _client.logIntoGuildFile(GuildID, `${_old.member?.user.username} just joined ${_new.channel?.name}`);
  }
  else
  {
    _client.logIntoGuildFile(GuildID, `${_old.member?.user.username} moved from ${_old.channel?.name} to ${_new.channel?.name}`);
  }

  const Adapter = Bot.voice.adapters.get(GuildID);

  let AudioConnection = getVoiceConnection(GuildID);
  const VoiceChannelID = _new.channel.id;

  //If Connection does not exist then Bot joins the channel.
  if (!AudioConnection)
  {
    AudioConnection = joinVoiceChannel({
      channelId: VoiceChannelID,
      guildId: GuildID,
      adapterCreator: BotVoiceAdapter
    });

    //Register this player
    const Player = createAudioPlayer();
    _client.addPlayer(GuildID, Player);

    AudioConnection.subscribe(Player);

    _client.logIntoGuildFile(GuildID, `Created Player for "${Guild.name}" in voiceStateUpdate event.`);
    return;
  }

  Bot.channels.fetch(VoiceChannelID)
    .then(_channel => 
    {
      const VoiceChannel = _channel as BaseGuildVoiceChannel;
      if (VoiceChannel.members.has(BotID))
      {
        const ResoruceMngr = _client.ResMng;
        const SoundsData = ResoruceMngr.getJSON("sounds");
        if (!SoundsData)
        {
          _client.errorIntoGuildFile(GuildID, "Sound Data could not be found.");
          return;
        }

        const Sound = SoundsData[UserID][GuildID] ?? SoundsData[UserID].default;
        const AudioPath = `${process.env.SOUND_LOCAL_PATH}${Sound}.mp3`;
        playSound(_client, AudioPath, GuildID);
      }
    });
}

function checkStates(_new: Discord.VoiceState, _old: Discord.VoiceState): boolean
{
  if (_old.mute && !_new.mute || !_old.mute && _new.mute) { return false; }
  if (_old.deaf && !_new.deaf || !_old.deaf && _new.deaf) { return false; }
  if (_old.streaming && !_new.streaming || !_old.streaming && _new.streaming) { return false; }
  if (_old.selfVideo && !_new.selfVideo || !_old.selfVideo && _new.selfVideo) { return false; }

  return true;
}