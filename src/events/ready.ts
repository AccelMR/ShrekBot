/* External imports */
import Discord from "discord.js";

/** Own Modules */
import { log } from "../Helpers/helpers";
import { ShrekBot } from "../shrekBot";

/**
 * Summary. Event when the client is ready to be used.
 *
 * @access  public
 *
 * @param {ShrekBot}   Bot Own reference of Shrek Bot.
 *
 * @param {Discord.Message}   Message that was send with this event.
 *
 * @return {void}
 */
export const event = (_client: ShrekBot, _message: Discord.Message) => {
  log("Shrek bot has connected!");
};
