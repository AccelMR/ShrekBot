/* External imports */
import { Client } from "discord.js";

/** Own Modules */
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
export const event = (_client: ShrekBot, bot: Client) => {
  console.log("Shrek bot is ready!");

  const Accel = bot.guilds.cache.at(0)?.members.cache.get(process.env.OWNER_ID ?? "");
  if(Accel){
    _client.Owner = Accel;
    Accel.send(`Starting Bot...`);
  }

  _client._onBotReady();
};
