/**
 * @Description Command for delete.
 *
 * @author Accel Magaña Rodriguez. <accel.mr@gmail.com>
 */

/* External imports */
import Discord, { TextChannel } from "discord.js";

/** Own modules  */
import { ShrekBot } from "../shrekBot";

//Triggers to call this command
export const Triggers: string[] = ["delete", "d"];

/**
 * Summary.Delete given number of messages.
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
  //Get username of the one who calle this command
  const userName = _message.author.username;
  //Get channel
  const channel = _message.channel as TextChannel;

  const Guild = _message.guild;
  if (!Guild) { return; }
  const GuildID = Guild.id;

  //Delete this command
  _message.delete();

  //Calculate how many messages this is going to delete
  let messageToDelete: number = _args?.length === 0 ? 1 : +_args[0];
  messageToDelete = messageToDelete.clamp(1, 99);

  clear(messageToDelete, channel);
  _client.logIntoGuildFile(GuildID, `${userName} deleted ${messageToDelete} messages.`);
}

/**
 * Summary. Async clear to actual delete messages.
 *
 * @access  public
 *
 * @return {void}
 */
async function clear(_toDelete: number, _channel: TextChannel)
{
  try
  {
    const fetched = await _channel.messages.fetch({ limit: _toDelete });
    _channel.bulkDelete(fetched);
  }
  catch (Error)
  {
    console.error(Error);
  }
}
