/**
 * @Description Spam command.
 *
 * @author Accel Magaña Rodriguez. <accel.mr@gmail.com>
 */

/* External imports */
import Discord from "discord.js";

/** Own modules  */
import { log, error } from "../Helpers/helpers";
import { getMemberByName } from "../Helpers/discordHelper";
import { ShrekBot } from "../shrekBot";

//Triggers to call this command
export const Triggers: string[] = ["spam", "sp"];

/**
 * Summary.Spam to a given user.
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
  //Get all members in this guild
  let Guild = _message.guild;
  let MemberManager = Guild.members;
  let Members = MemberManager.cache;
  let SpamerName = _message.author.username;

  //Delete this command
  _message.delete();

  if (typeof _args[0] === "undefined") {
    return error("No srgs sent");
  }

  let ToSpamName = _args[0];
  var MessageToSpam = _args[1] ?? ".";
  var SpamTimes: number = +_args[2] ?? 5;

  let Member = getMemberByName(ToSpamName, _client, Members);
  if (!Member) return error(`Member ${ToSpamName} not found from Spam command.`);

  Member.createDM().then((_dmChannel) => {
    for (let i = 0; i < SpamTimes; i++) {
      _dmChannel.send(MessageToSpam);
    }
    log(
      `${SpamerName} has spammed -${MessageToSpam}- to ${ToSpamName} this many times ${SpamTimes}`
    );
  });
}
