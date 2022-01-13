/**
 * @Description Command for delete.
 *
 * @author Accel Magaña Rodriguez. <accel.mr@gmail.com>
 */

/* External imports */
import Discord, { TextChannel } from "discord.js";
import { BaseCommand, ParameterDetails } from "../Helpers/baseCommand";

/** Own modules  */
import { ShrekBot } from "../shrekBot";

/**
 * Delete messages command.
 */
export class DeleteMessagesCommand implements BaseCommand
{
  /**
   * Descriptor members.
   */
  Triggers: string[] = ["deletemessage", "delmsg"];
  Summary: string = "Deletes N number of previous messages.";
  Description: string = "Deletes N number of previous messages. This command can't delete mora than 99 messages.";
  Params: ParameterDetails[] =
    [
      {
        Name: "Number of Messages",
        Type: "number",
        Optional: true,
        Default: "1",
        Description: "How many previous messages this command will delete."
      }
    ];
  Example: string = 'deletemessage | deletemessage 5';

  /**
   * The actual execution of the command.
   * @param _client The actual shrekBot.
   * @param _message message command.
   * @param _args Parameters
   * @returns void
   */
  run(_client: ShrekBot, _message: Discord.Message<boolean>, _args: string[])
  {
    //Get username of the one who calle this command
    const userName = _message.author.username;
    //Get channel
    const channel = _message.channel as TextChannel;

    const Guild = _message.guild;
    if (!Guild) { return; }
    const GuildID = Guild.id;

    //Delete this command
    _message.delete()
      .then(() =>
      {
        //Calculate how many messages this is going to delete
        let messageToDelete: number = _args?.length === 0 ? 1 : +_args[0];
        messageToDelete = messageToDelete.clamp(1, 99);

        clearMessageBulk(messageToDelete, channel);
        _client.logIntoGuildFile(GuildID, `${userName} deleted ${messageToDelete} messages.`);
      });
  }

}

/**
 * Creates Command Reference since it can't be created outside if it is dynamc.
 * @returns AdNickCommand reference
 */
export function createCommand(): BaseCommand
{
  return new DeleteMessagesCommand();
}

/**
 * Summary. Async clear to actual delete messages.
 *
 * @access  public
 *
 * @return {void}
 */
async function clearMessageBulk(_toDelete: number, _channel: TextChannel)
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
