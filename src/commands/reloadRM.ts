/**
 * @Description Reload Resource manager command.
 *
 * @author Accel Magaña Rodriguez. <accel.mr@gmail.com>
 */

/* External imports */
import Discord from "discord.js";
import fs from "fs"
import path from "path"

/** Own modules  */
import { log, error } from "../Helpers/helpers";
import { ShrekBot } from "../shrekBot";

//Triggers to call this command
export const Triggers: string[] = ["rejson"];

/**
 * Summary.Realods jsons if there was a change on them.
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
  //Delete this command
  _message.delete();
  _client.loadResourceManagerData();

  log(`Reloaded all Resources.`);
}
