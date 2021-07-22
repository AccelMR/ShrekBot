/**
 * @Description Add sound to Guild command.
 *
 * @author Accel Magaña Rodriguez. <accel.mr@gmail.com>
 */

/* External imports */
import Discord, { TextChannel } from "discord.js";
import fs from "fs";
import path from "path";

/** Own modules  */
import { getMemberByName } from "../Helpers/discordHelper";
import { error, log } from "../Helpers/helpers";
import { ShrekBot } from "../shrekBot";

//Triggers to call this command
export const Triggers: string[] = ["addsound"];

/**
 * Summary.Add sound to the json file, it attaches to the guild where the command came from.
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
  const Guild = _message.guild;
  const GuildId = Guild.id;
  const textChannel = _message.channel as TextChannel;
  const SoundData = _client.getJSON("sounds");

  //Delete this command
  _message.delete();

  if (!_args || _args.length !== 2) {
    const message = "Not enough arguments sent.";
    textChannel.send("Nah, ni poner un comando sabe.");
    return error(message);
  }

  const ToAdd = getMemberByName(_args[0], _client, Guild.members.cache);
  const ToAddName = ToAdd.user.username;
  if (!ToAdd) {
    textChannel.send("¿Quién es ese?");
    return error("Person could not be find.");
  }

  const SoundName = _args[1];

  //If This person has no field yet, it creates it
  if (!(ToAddName in SoundData)) {
    SoundData[ToAddName] = {};
  }

  SoundData[ToAddName][GuildId] = SoundName;

  fs.writeFile(
    path.resolve(__dirname, `../../../resources/json/sounds.json`),
    JSON.stringify(SoundData),
    function writeJSON(_err) {
      if (_err) return error(_err);
    }
  );

  log(`Added ${SoundName}.mp3 to ${ToAddName} in ${Guild.name}`);
}
