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
  let Channel = _message.channel;

  //Delete this command
  _message.delete();

  //If not arguments were send
  if (!_args || _args.length !== 2) {
    let message = `I didn't even get arguments, noob.`;
    Channel.send(message);
    log("No args were send");
    return;
  }

  let NicksData = _client.getJSON("nicks");
  //Nicks only can be saved with lower case
  let Nick = _args[0].toLowerCase();
  let RealName = _args[1];

  //If nick already exist then it'll return
  if (Nick in NicksData) {
    let message = `${Nick} exists already in the nicks for ${NicksData[Nick]}`;
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
    path.resolve(__dirname, `../../resources/additional/nicks.json`),
    JSON.stringify(NicksData),
    function writeJSON(_err) {
      if (_err) return error(_err);
    }
  );

  log(`${RealName} has new Nick ${Nick}`);
}
