/*
*
* Funciton that reacts to a message.
* It takes an emoji map to work. See emojimap.json
*
* @author Accel Magaña accel.mr@gmail.com
*/


import { _getInteger, log } from "../Helpers.js"

export const Triggers = ['react', 'r']

/*Reacts to a message with a given word
 * As first parameter you can send the word to react
 * As second parameter you can send the index of the message that user wants to react
 * NOTE: it only can react up to 10 last messages
 */
export const run = (_client, _message, _args) => {
  var channel = _message.channel;

  /*
   * Delete this command
   * In this specific case we need to wait until the command is deleted so it does not change the way 
   * fetched messages are returned
   */
  _message.delete()
    .then(response => {
      if (typeof _args[0] === "undefined") { return error("No word send"); }

      //Get the index message that want to react
      var WordToReact = _args[0].toLowerCase();
      var ToReact = (!_args || _args.length === 0) ? 1 : _getInteger(_args[1], 1);
      ToReact -= 1;

      //Fetch 10 last messages
      channel.messages.fetch({ limit: 10 })
        .then((_messages => {

          //Then for each message find the proper index and react to that message
          //NOTE: Couldn't find a way to acess quickly to a specific message, that's why I used map
          var i = 0;
          _messages.map((function (_msg, _indx, _array) {
            if (i === ToReact) {
              //Calls async funtion so it can react in the proper order
              MessageReact(_msg, _client.getJSON("emojimap"), WordToReact);
            }
            i++;
          }))
        }));
    });

}

//Async function just to make sure that the reaction happens at the right time. 
async function MessageReact(_msg, _emojiMap, _reactWord) {
  let AppearedCharacters = {}

  //Counts how many times a letter appears and if there's enough letters to make the word, then it'll react
  for (const character of _reactWord) {
    if (!(character in AppearedCharacters)) {
      AppearedCharacters[character] = 0
    }
    AppearedCharacters[character] += 1;

    if (character in _emojiMap) {
      let Emojis = _emojiMap[character];
      let timesAppeared = AppearedCharacters[character];
      if (timesAppeared <= Emojis.length) {
        await _msg.react(Emojis[timesAppeared - 1]);
      }

    }
  }
}