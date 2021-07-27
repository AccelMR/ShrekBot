/**
 * @Description Event caller.
 *
 * @author Accel Magaña Rodriguez. <accel.mr@gmail.com>
 */

/* External imports */
import Discord from "discord.js";

/** Own Modules */
import { log, error } from "../Helpers/helpers";
import { ShrekBot } from "../shrekBot";
import { ResourceManager } from "../resourceManager";
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
) {
  //No case to continue if the user just disconnected or did another action that's not just connect
  if (!_new.channel || (_old.channel && _old.channel === _new.channel)) { return; }

  const resourceManager = _client.ResMng;

  const BotVoice = _new.guild.voice;
  const SoundsData = resourceManager.getJSON("sounds");
  const GuildID = _new.guild.id;

  const Bot = _client.Bot;
  if (!Bot) {
    return error("Bot is null in message event.");
  }

  if (!SoundsData) {
    return error("Sound Data could not be found.");
  }

  //If Bot ain't connected when someone just connected then it'll connect
  if (!BotVoice) {
    _new.channel.join().then((_connection) => {
      const BotId = Bot.user?.id;
      if (!BotId) {
        return error("BotId is undefined in VoiceUpdate");
      }

      const sound = SoundsData[BotId][GuildID] ?? SoundsData[BotId].default;

      _connection.play(process.env.SOUND_LOCAL_PATH + sound + ".mp3");
    });
    return;
  }

  const BotVoiceChannel = BotVoice.channel;
  const UserVoiceChannel = _new.channel;
  const VoiceConnection = BotVoice.connection;

  //If user just connected to a channel where the bot is not connected, then do nothing
  if (UserVoiceChannel !== BotVoiceChannel) {
    return;
  }

  const UserId = _new.member?.user.id;
  if (UserId && UserId in SoundsData && VoiceConnection) {
    if (VoiceConnection.dispatcher) {
      //TODO: Add it to the queue
      return;
    }

    //Take the sound as default or per guild
    const sound = SoundsData[UserId][GuildID] ?? SoundsData[UserId].default;

    try {
      const Dispatcher = VoiceConnection.play(
        process.env.SOUND_LOCAL_PATH + sound + ".mp3"
      );

      //TODO: Make a queue
      Dispatcher.on("finish", () => {});
    } catch (_err) {
      error(_err);
    }
  }
}
