/* External imports */
import Discord from "discord.js";
import { BaseCommand, ParameterDetails } from "../Helpers/baseCommand";

/** Own modules  */
import { ShrekBot } from "../shrekBot";

/**
 * Reload event command.
 */
export class ReloadEventsCommand implements BaseCommand
{

  /**
   * Descriptor members.
   */
  Triggers: string[] = [`reloadevents`, `revent`];
  Summary: string = `Reload all events.`;
  Description: string = `Reload all events inside Event folder.`;
  Params: ParameterDetails[] = [];
  Example: string = 'reloadevents, revent';

  /**
   * The actual execution of the command.
   * @param _client The actual shrekBot.
   * @param _message message command.
   * @param _args Parameters
   * @returns void
   */
  run(_client: ShrekBot, _message: Discord.Message<boolean>, _args: string[])
  {
    _message.delete();
    console.log("Events reloaded");
    _client.loadEvents();
  }
}

/**
 * Creates a NickCommand since it can't be created outside after importing.
 * @returns AdNickCommand reference
 */
 export function createCommand(): BaseCommand
 {
   return new ReloadEventsCommand();
 }