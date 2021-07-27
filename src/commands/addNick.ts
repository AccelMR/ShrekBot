/**
 * @Description Add nick command.
 *
 * @author Accel Magaña Rodriguez. <accel.mr@gmail.com>
 */

/* External imports */
import Discord from "discord.js";
import fs from "fs";
import path from "path";

/** Own modules  */
import { log, error } from "../Helpers/helpers";
import { ShrekBot } from "../shrekBot";
import { ResourceManager } from "../resourceManager";

//Triggers to call this command
export const Triggers: string[] = ["addnick"];

/**
 * Summary.Adds a nick to a person, so then users can call them as nick instead of discord name.
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
export function run(_client: ShrekBot, _message: Discord.Message, _args: string[]) {
  const Channel = _message.channel;
  const resourceManager = _client.ResMng;

  //Delete this command
  _message.delete();

  //If not arguments were send
  if (_args?.length !== 2) {
    const message = `I didn't even get arguments, noob.`;
    Channel.send(message);
    log("No args were send");
    return;
  }

  let NicksData = resourceManager.getJSON("nicks");
  //Nicks only can be saved with lower case
  let Nick = _args[0].toLowerCase();
  let RealName = _args[1];

  //If nick already exist then it'll return
  if (Nick in NicksData) {
    const message = `${Nick} exists already in the nicks for ${NicksData[Nick]}`;
    Channel.send(message);
    log(message);
    return;
  }

  //If user sends another nick as the main nick
  if (RealName in NicksData) {
    RealName = NicksData[RealName];
  }

  //Adds it to the nick data and also writes it to the data file
  NicksData[Nick] = RealName;
  fs.writeFile(
    path.resolve(__dirname, `../../resources/json/nicks.json`),
    JSON.stringify(NicksData),
    function writeJSON(_err) {
      if (_err) return error(_err);
    }
  );

  log(`${RealName} has new Nick ${Nick}`);
}
