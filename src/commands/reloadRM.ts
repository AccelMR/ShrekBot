/**
 * @Description Reload Resource manager command.
 *
 * @author Accel Magaña Rodriguez. <accel.mr@gmail.com>
 */

/* External imports */
import Discord from "discord.js";
import fs from "fs";
import path from "path";

/** Own modules  */
import { ShrekBot } from "../shrekBot";

//Triggers to call this command
export const Triggers: string[] = ["rejson", "rjson"];

/**
 * Summary.Reloads jsons if there was a change on them.
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
  const Guild = _message.guild;
  if (!Guild) { return; }
  const GuildID = Guild.id;
  //Delete this command
  _message.delete();
  _client.ResMng.loadResourceManagerData();
  _client.logIntoGuildFile(GuildID, `${_message.member?.user.username} has requested to reload resources.`);
}
