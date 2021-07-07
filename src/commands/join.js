import { _getInteger, log } from "../Helpers.js"

export const Triggers = ['join', 'ven', 'sherk']

//Delete a number od messages in command channel
export const run = (_client, _message, _args) => { 
   //Delete this command
  _message.delete();

  //Get username of the one who calle this command
  let userName = _message.author.username;

  let member = _message.member;
  let voiceChannel = member.voice.channel; 

  if(null === voiceChannel) return log(`No voice channel found for ${userName}`)

  voiceChannel.join();
}