/**
 * @Description Event caller.
 *
 * @author Accel Magaña Rodriguez. <accel.mr@gmail.com>
 */

/* External imports */
import Discord from "discord.js";

/** Own Modules */
import { log } from "../Helpers/helpers";
import { ShrekBot } from "../shrekBot";
/**
 * Summary. Event when voice State changes.
 *
 * @access  public
 *
 * @param {ShrekBot}   Bot Own reference of Shrek Bot.
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
  if (!_new.channel || (_old.channel !== null && _old.channel === _new.channel)) {
    return;
  }

  const BotVoice = _new.guild.voice;
  const SoundsData = _client.getJSON("sounds");
  const GuildID = _new.guild.id;

  //If Bot ain't connected when someone just connected then it'll connect
  if (!BotVoice) {
    _new.channel.join().then((_connection) => {
      const BotId = _client.Bot.user.id;
      let sound =
        GuildID in SoundsData.CherkBot
          ? SoundsData.BotId[GuildID]
          : SoundsData.BotId.default;

      _connection.play(_client.Config.SoundsPath + sound + ".mp3");
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

  const UserId = _new.member.user.id;
  if (UserId in SoundsData && null !== VoiceConnection) {
    if (VoiceConnection.dispatcher) {
      //TODO: Add it to the queue
      return;
    }

    //Take the sound as default or per guild
    let sound =
      GuildID in SoundsData[UserId]
        ? SoundsData[UserId][GuildID]
        : SoundsData[UserId].default;

    const Dispatcher = VoiceConnection.play(_client.Config.SoundsPath + sound + ".mp3");

    //TODO: Make a queue
    Dispatcher.on("finish", () => {});
  }
}
