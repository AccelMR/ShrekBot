import { log } from "../Helpers.js"

export const event = (_client, _old, _new) => {
  if (!_new.channel) { return; }
  if (_old.channel !== null && _old.channel === _new.channel) { return; }

  let BotVoice = _new.guild.voice;
  let SoundsData = _client.getJSON("sounds");

  if (!BotVoice) {
    _new.channel.join()
      .then((_connection) => {
        _connection.play(_client.Config.SoundsPath + SoundsData.CherkBot + ".mp3");
      });

    return;
  }

  let BotVoiceChannel = BotVoice.channel;
  let UserVoiceChannel = _new.channel;
  let VoiceConnection = BotVoice.connection;

  if (UserVoiceChannel !== BotVoiceChannel) { return; }

  let MemberName = _new.member.user.username;
  if (MemberName in SoundsData && null !== VoiceConnection) {
    VoiceConnection.play(_client.Config.SoundsPath + SoundsData[MemberName] + ".mp3");
  }


};
