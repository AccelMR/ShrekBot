/**
 * @Description Event caller.
 *
 * @author Accel Magaña Rodriguez. <accel.mr@gmail.com>
 */

/* External imports */
import { BaseGuildVoiceChannel, VoiceState } from "discord.js";

/** Own Modules */
import { ShrekBot } from "../shrekBot";
import { createAudioPlayer, DiscordGatewayAdapterCreator, getVoiceConnection, joinVoiceChannel } from "@discordjs/voice";
import { playSoundFromFile } from "../Helpers/discordHelper";
import { fstat } from "fs";
import { soundExist } from "../Helpers/helpers";
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
  _old: VoiceState,
  _new: VoiceState
)
{
  const Guild = _new.guild;
  const GuildID = Guild.id;

  if (!checkStates(_new, _old)) { return; }

  //No case to continue if the user just disconnected or did another action that's not just connect
  if (!_new.channel)
  {
    _client.logIntoGuildFile(GuildID, `${_old.member?.user.username} left ${_old.channel?.name}`);
    return;
  }

  const Bot = _client.Bot;
  if (!Bot || !Bot.user)
  {
    _client.errorIntoGuildFile(GuildID, "Bot is null in voiceStateUpdate event.");
    return;
  }

  const BotID = Bot.user.id;
  const UserID = _new.member?.user.id;
  const UserName = _new.member?.user.username;

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
      adapterCreator: _new.guild.voiceAdapterCreator as DiscordGatewayAdapterCreator //TODO: this does not have yo be any but Discord and Discord Voice don't match types
    });

    //Register this User
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

        if (!SoundsData[UserID])
        {
          _client.warningIntoGuildFile(GuildID, `There is no sound for ${UserName}.`);
          return;
        }

        const Sound = SoundsData[UserID][GuildID] ?? SoundsData[UserID].default;
        const AudioPath = `${process.env.SOUND_LOCAL_PATH}${Sound}.mp3`;
        if(!soundExist(AudioPath))
        {
          _client.errorIntoGuildFile(GuildID, `That sound does not exist in the context.`);
          return;
        }
        playSoundFromFile(_client, AudioPath, GuildID);
      }
    });
}

function checkStates(_new: VoiceState, _old: VoiceState): boolean
{
  if (_old.mute && !_new.mute || !_old.mute && _new.mute) { return false; }
  if (_old.deaf && !_new.deaf || !_old.deaf && _new.deaf) { return false; }
  if (_old.streaming && !_new.streaming || !_old.streaming && _new.streaming) { return false; }
  if (_old.selfVideo && !_new.selfVideo || !_old.selfVideo && _new.selfVideo) { return false; }

  return true;
}