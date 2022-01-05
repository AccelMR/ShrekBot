
/**
 * @Description Reload command.
 * 
 * @author Accel Magaña Rodriguez. <accel.mr@gmail.com>
 */

/* External imports */
import Discord from "discord.js";

/** Own modules  */
import { ShrekBot } from "../shrekBot";

//Triggers to call this command
export const Triggers: string[] = ["recmd"];

/**
 * Summary.Reloads all other commands, including new ones.
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
  //Delete this command
  _message.delete();
  console.log("Reload all commands.");
  _client.loadCommands();
};
