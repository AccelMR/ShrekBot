import { _getInteger, log, getMemberByName, error } from "../Helpers.js"

export const Triggers = ['spam', "sp"]


export const run = (_client, _message, _args) => {
  //Get all members in this guild
  let Guild = _message.guild;
  let MemberManager = Guild.members;
  let Members = MemberManager.cache;
  let SpamerName = _message.author.username;

  //Delete this command
  _message.delete();

  if (typeof _args[0] === 'undefined') { return error("No srgs sent"); }

  let ToSpamName = _args[0];
  var MessageToSpam = typeof _args[1] === 'undefined' ? "." : _args[1];
  var SpamTimes = typeof _args[2] === 'undefined' ? 5 : _getInteger(_args[2]);
  
  let Member = getMemberByName(ToSpamName, _client, Members);
  if (!Member) return error(`Member ${ToSpamName} not found from Spam command.`);

  Member.createDM()
    .then(_dmChannel => {
      for (let i = 0; i < SpamTimes; i++) {
        _dmChannel.send(MessageToSpam);
      }
      log(`${SpamerName} has spammed -${MessageToSpam}- to ${ToSpamName} this many times ${SpamTimes}`);
    });

}