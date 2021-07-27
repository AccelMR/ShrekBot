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
import { ResourceManager } from "../resourceManager";

//Triggers to call this command
export const Triggers: string[] = ["addsound"];

/**
 * Summary.Add sound to the json file, it attaches to the guild where the command came from.
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
  const resourceManager = _client.ResMng;
  const Guild = _message.guild;
  if (!Guild) {
    return error("Guild is undefined in addSound command");
  }
  const GuildId = Guild.id;
  const textChannel = _message.channel as TextChannel;
  const SoundData = resourceManager.getJSON("sounds");
  const Default = "default";
  let serverIdentifier = GuildId;

  //Delete this command
  _message.delete();

  if (_args?.length < 2) {
    const message = "Not enough arguments sent.";
    textChannel.send("Nah, ni poner un comando sabe.");
    return error(message);
  }

  const ToAdd = getMemberByName(_args[0].toLowerCase(), _client, Guild.members.cache);
  const ToAddId = ToAdd?.user.id;
  if (!ToAdd || !ToAddId) {
    textChannel.send("¿Quién es ese?");
    return error("Person could not be find.");
  }

  const SoundName = _args[1];
  if (_args.length > 2 && _args[2] === Default) {
    serverIdentifier = Default;
  }

  //If This person has no field yet, it creates it
  if (!(ToAddId in SoundData)) {
    SoundData[ToAddId] = {};
  }

  SoundData[ToAddId][serverIdentifier] = SoundName;

  fs.writeFile(
    path.resolve(__dirname, `../../../resources/json/sounds.json`),
    JSON.stringify(SoundData),
    function writeJSON(_err) {
      if (_err) return error(_err);
    }
  );

  const GuildDefault = serverIdentifier === Default ? Default : Guild.name;
  log(`Added ${SoundName}.mp3 to ${ToAdd.user.username} in ${GuildDefault}`);
}
