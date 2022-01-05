/* External imports */
import Discord from "discord.js";

/** Own modules  */
import { ShrekBot } from "../shrekBot";

//Triggers to call this event
export const Triggers: string[] = ["reevent", "revent"];

/**
 * Summary. Actual execution of the command.
 *
 * @access  public
 *
 * @param {ShrekBot}   Bot Own reference to Shrek bot.
 *
 * @param {Discord.Message}   Message Discord message.
 *
 * @param {Array}   Array of arguments.
 * 
 * @return {void} 
 */
export function run(_client: ShrekBot, _message: Discord.Message, _args: string[])
{
  _message.delete();
  console.log("Events reloaded");
  _client.loadEvents();
};