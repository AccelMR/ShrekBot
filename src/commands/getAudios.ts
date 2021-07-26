/**
 * @Description Get Audios from drive.
 * 
 * @author Accel Magaña Rodriguez. <accel.mr@gmail.com>
 */

/* External imports */
import Discord from "discord.js";

/** Own modules  */
import { log } from "../Helpers/helpers";
import { RemoteResources } from "../remoteResources";
import { ResourceManager } from "../resourceManager";
import { ShrekBot } from "../shrekBot";

//Triggers to call this command
export const Triggers: string[] = ["daudios"];

/**
 * Summary.Checks in drive folder if there's any new audio by name and downloads it.
 *
 * @access  public
 *
 * @param {ShrekBot}          Bot Own reference of Shrek bot.
 *
 * @param {Discord.Message}   Message Discord message.
 *
 * @param {Array}             Array of arguments.
 * 
 * @return {void} 
 */
export function run(_client: ShrekBot, _message: Discord.Message, _args : string[]){
  //Delete this command
  _message.delete();
  RemoteResources.Instance.checkIfNewAudios();
};
