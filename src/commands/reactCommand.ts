/**
 * @Description React command.
 *
 * @author Accel Magaña Rodriguez. <accel.mr@gmail.com>
 */

/* External imports */
import Discord from "discord.js";
import { BaseCommand, ParameterDetails } from "../Helpers/baseCommand";
import { checkParamLenght } from "../Helpers/discordHelper";

/** Own modules  */
import { ShrekBot } from "../shrekBot";

//Triggers to call this command
export const Triggers: string[] = ["r", "react"];


//Details of this command.
export const Details = `Reacts to previous message, by default the one above. If a number is sent it'll reacto the the message N times above.`;

//Param Desc for this command
export const Params = `<Word> <null | Number>`;

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
export function run(_client: ShrekBot, _message: Discord.Message, _args: string[])
{
}

export class ReactCommand implements BaseCommand
{
  /**
   * Descriptor members.
   */
  Triggers: string[] = ["react", "r"];
  Summary: string = `Reacts a previous message with a given word.`;
  Description: string = `Reacts a previous message with a given word. You can react to an older\
  by sending a number, starting with the latest message being 1 and so on.\
  There are a certain amount of letters and symbols depending on each one, for more information use command getEmojiMap
  @Bug. If the message already has a reaction the command won't work properly.`;
  Params: ParameterDetails[] =
    [
      {
        Name: "Word or Symbols",
        Type: "string",
        Optional: false,
        Default: "N/A",
        Description: "The word or symbols to react. There are a certain amount of reaction per letter, for more information\
        use command getEmojiMap."
      }
    ];
  Example: string = 'react reaction | r "rea ction" ';

  /**
   * The actual execution of the command.
   * @param _client The actual shrekBot.
   * @param _message message command.
   * @param _args Parameters
   * @returns void
   */
  run(_client: ShrekBot, _message: Discord.Message<boolean>, _args: string[])
  {
    const resourceManager = _client.ResMng;
    var channel = _message.channel;
    const Guild = _message.guild;
    if (!Guild) { return; }
    const GuildID = Guild.id;
    const UserName = _message.member?.user.username ?? "Unknown";


    //Check if arguments are correct.
    if (!checkParamLenght(_args, this.Params))
    {
      const Parameters = _args.join(`, `);
      _client.errorIntoGuildFile(GuildID, `Invoker: ${UserName}. Missing arguments in ${this.Triggers[0]}(). Params: [${Parameters}]`);
      return;
    }

    /*
     * Delete this command
     * In this specific case we need to wait until the command is deleted so it does not change the way
     * fetched messages are returned
     */
    _message.delete().then((response) =>
    {
      //Get the index message that want to react
      var WordToReact = _args[0].toLowerCase();
      var ToReact: number = _args?.length === 1 ? 1 : +_args[1];
      ToReact -= 1;

      //Fetch 10 last messages
      channel.messages.fetch({ limit: 10 }).then((_messages) =>
      {
        //Then for each message find the proper index and react to that message
        //NOTE: Couldn't find a way to acess quickly to a specific message, that's why I used map
        var i = 0;
        _messages.map(function (_msg, _indx, _array)
        {
          if (i === ToReact)
          {
            //Calls async funtion so it can react in the proper order
            _client.logIntoGuildFile(GuildID, `${UserName} reacted to -${_msg.content}-  with "${WordToReact}"`);
            MessageReact(_msg, resourceManager.getJSON("emojimap"), WordToReact);
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
  async MessageReact(
    _msg: Discord.Message,
    _emojiMap: Record<string, any>,
    _reactWord: string
  )
  {
    let AppearedCharacters: Record<string, any> = {};

    //Counts how many times a letter appears and if there's enough letters to make the word, then it'll react
    for (const character of _reactWord)
    {
      if (!(character in AppearedCharacters))
      {
        AppearedCharacters[character] = 0;
      }
      AppearedCharacters[character] += 1;

      if (character in _emojiMap)
      {
        let Emojis = _emojiMap[character];
        let timesAppeared = AppearedCharacters[character];
        if (timesAppeared <= Emojis.length)
        {
          await _msg.react(Emojis[timesAppeared - 1]);
        }
      }
    }
  }

}

/**
 * Creates a NickCommand since it can't be created outside after importing.
 * @returns AdNickCommand reference
 */
export function createCommand(): BaseCommand
{
  return new ReactCommand();
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
)
{
  let AppearedCharacters: Record<string, any> = {};

  //Counts how many times a letter appears and if there's enough letters to make the word, then it'll react
  for (const character of _reactWord)
  {
    if (!(character in AppearedCharacters))
    {
      AppearedCharacters[character] = 0;
    }
    AppearedCharacters[character] += 1;

    if (character in _emojiMap)
    {
      let Emojis = _emojiMap[character];
      let timesAppeared = AppearedCharacters[character];
      if (timesAppeared <= Emojis.length)
      {
        await _msg.react(Emojis[timesAppeared - 1]);
      }
    }
  }
}