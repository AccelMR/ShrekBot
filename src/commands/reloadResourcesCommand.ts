/**
 * @Description Reload Resource manager command.
 *
 * @author Accel Magaña Rodriguez. <accel.mr@gmail.com>
 */

/* External imports */
import Discord from "discord.js";
import { BaseCommand, ParameterDetails } from "../Helpers/baseCommand";

/** Own modules  */
import { ShrekBot } from "../shrekBot";

/**
 * Reload resoruces command.
 */
export class ReloadResourcesCommand implements BaseCommand
{

  /**
   * Descriptor members.
   */
  Triggers: string[] = [`reloadresources`, `reloadjson`];
  Summary: string = `Reload all resources.`;
  Description: string = `Reload all resources in resource foldeer. Must be json.`;
  Params: ParameterDetails[] = [];
  Example: string = 'reloadevetnts | revent';

  /**
   * The actual execution of the command.
   * @param _client The actual shrekBot.
   * @param _message message command.
   * @param _args Parameters
   * @returns void
   */
  run(_client: ShrekBot, _message: Discord.Message<boolean>, _args: string[])
  {
    const Guild = _message.guild;
    if (!Guild) { return; }
    const GuildID = Guild.id;
    //Delete this command
    _message.delete();
    _client.ResMng.loadResourceManagerData();
    _client.logIntoGuildFile(GuildID, `${_message.member?.user.username} has requested to reload resources.`);
  }
}

/**
 * Creates a NickCommand since it can't be created outside after importing.
 * @returns AdNickCommand reference
 */
 export function createCommand(): BaseCommand
 {
   return new ReloadResourcesCommand();
 }