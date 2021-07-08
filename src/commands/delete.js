import { _getInteger, log } from "../Helpers.js"

export const Triggers = ['delete', 'borrar']

//Delete a number od messages in command channel
export const run = (_client, _message, _args) => {
  //Delete this command
  _message.delete();

  //Get username of the one who calle this command
  let userName = _message.author.username;
  //Get channel
  var channel = _message.channel;

  //Calculate how many messages this is going to delete
  let toDelete = (!_args || _args.length === 0) ? 1 : _args[0];
  let messageToDelete = _getInteger(toDelete, 1);
  messageToDelete = messageToDelete >= 100 ? 99 : messageToDelete;

  clear(messageToDelete, channel);
  log(`${userName} deleted ${messageToDelete} messages.`)
}


//async funtion to delete the messages
async function clear(_toDelete, _channel) {
  const fetched = await _channel.messages.fetch({ limit: _toDelete });
  _channel.bulkDelete(fetched);
}