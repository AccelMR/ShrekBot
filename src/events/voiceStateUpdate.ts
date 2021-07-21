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
export function event(_client: ShrekBot, _old: Discord.VoiceState, _new: Discord.VoiceState) {
  if (!_new.channel) {
    return;
  }
  if (_old.channel !== null && _old.channel === _new.channel) {
    return;
  }

  const BotVoice = _new.guild.voice;
  const SoundsData = _client.getJSON("sounds");

  if (!BotVoice) {
    _new.channel.join().then((_connection) => {
      _connection.play(_client.Config.SoundsPath + SoundsData.CherkBot + ".mp3");
    });

    return;
  }

  let BotVoiceChannel = BotVoice.channel;
  let UserVoiceChannel = _new.channel;
  let VoiceConnection = BotVoice.connection;

  if (UserVoiceChannel !== BotVoiceChannel) {
    return;
  }

  let MemberName = _new.member.user.username;
  if (MemberName in SoundsData && null !== VoiceConnection) {
    if (VoiceConnection.dispatcher) {
      //Add it to the queue
      return;
    }

    const Dispatcher = VoiceConnection.play(
      _client.Config.SoundsPath + SoundsData[MemberName] + ".mp3"
    );
    Dispatcher.on("finish", () => {
      //log(`Finish playing ${SoundsData[MemberName]}.mp3"`);
    });
  }
}
