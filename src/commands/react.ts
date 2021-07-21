/**
 * @Description React command.
 *
 * @author Accel Magaña Rodriguez. <accel.mr@gmail.com>
 */

/* External imports */
import Discord from "discord.js";

/** Own modules  */
import { log, error } from "../Helpers/helpers";
import { ShrekBot } from "../shrekBot";

//Triggers to call this command
export const Triggers: string[] = ["r", "react"];

/**
 * Summary. React command to put some emojis under the messages.
 *
 * @access  public
 *
 * @param {ShrekBot}   Bot Own reference of Shrek bot.
 *
 * @param {Discord.Message}   Message Discord message.
 *
 * @param {Array}   Array of arguments.
 *
 * @return {void}
 */
export function run(_client: ShrekBot, _message: Discord.Message, _args: string[]) {
  var channel = _message.channel;

  /*
   * Delete this command
   * In this specific case we need to wait until the command is deleted so it does not change the way
   * fetched messages are returned
   */
  _message.delete().then((response) => {
    if (typeof _args[0] === "undefined") {
      return log("No word send");
    }

    //Get the index message that want to react
    var WordToReact = _args[0].toLowerCase();
    var ToReact: number = !_args || _args.length === 1 ? 1 : +_args[1];
    ToReact -= 1;

    //Fetch 10 last messages
    channel.messages.fetch({ limit: 10 }).then((_messages) => {
      //Then for each message find the proper index and react to that message
      //NOTE: Couldn't find a way to acess quickly to a specific message, that's why I used map
      var i = 0;
      _messages.map(function (_msg, _indx, _array) {
        if (i === ToReact) {
          //Calls async funtion so it can react in the proper order
          MessageReact(_msg, _client.getJSON("emojimap"), WordToReact);
        }
        i++;
      });
    });
  });
}

/**
 * Summary. Async function just to make sure that the reation happens at the right time.
 *
 * @access  private
 *
 * @return {void}
 */
async function MessageReact(
  _msg: Discord.Message,
  _emojiMap: Record<string, any>,
  _reactWord: string
) {
  let AppearedCharacters: Record<string, any> = {};

  //Counts how many times a letter appears and if there's enough letters to make the word, then it'll react
  for (const character of _reactWord) {
    if (!(character in AppearedCharacters)) {
      AppearedCharacters[character] = 0;
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