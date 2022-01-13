
/**
 * @Description Reload command.
 * 
 * @author Accel Magaña Rodriguez. <accel.mr@gmail.com>
 */

/* External imports */
import Discord from "discord.js";
import { BaseCommand, ParameterDetails } from "../Helpers/baseCommand";

/** Own modules  */
import { ShrekBot } from "../shrekBot";

/**
 * reload commands from resources.
 */
export class ReloadCommandsCommand implements BaseCommand
{
  /**
   * Descriptor members.
   */
  Triggers: string[] = [`reloadcommands`, `rcmd`];
  Summary: string = `Reload all commands.`;
  Description: string = `Reload all commands that are inside commands folder.`;
  Params: ParameterDetails[] = [];
  Example: string = 'reloadcommdas | rcmd';

  /**
   * The actual execution of the command.
   * @param _client The actual shrekBot.
   * @param _message message command.
   * @param _args Parameters
   * @returns void
   */
  run(_client: ShrekBot, _message: Discord.Message<boolean>, _args: string[])
  {
    //Delete this command
    _message.delete();
    console.log("Reload all commands.");
    _client.loadCommands();
  }
}

/**
 * Creates a NickCommand since it can't be created outside after importing.
 * @returns AdNickCommand reference
 */
 export function createCommand(): BaseCommand
 {
   return new ReloadCommandsCommand();
 }