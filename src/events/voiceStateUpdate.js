import { log } from "../Helpers.js"

export const event = (_client, _old, _new) => {
  if (!_new.channel) { return; }
  if (_old.channel !== null && _old.channel === _new.channel) { return; }

  let BotVoice = _new.guild.voice;

  if (!BotVoice) {
    _new.channel.join()
      .then((_connection) => {
        _connection.play(_client.Config.SoundsPath + _client.JSONSounds.CherkBot + ".mp3");
      });

    return;
  }

  let BotVoiceChannel = BotVoice.channel;
  let UserVoiceChannel = _new.channel;
  let VoiceConnection = BotVoice.connection;

  if (UserVoiceChannel !== BotVoiceChannel) { return; }

  let MemberName = _new.member.user.username;
  if (MemberName in _client.JSONSounds) {
    VoiceConnection.play(_client.Config.SoundsPath + _client.JSONSounds[MemberName] + ".mp3");
  }


};
