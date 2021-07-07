import { log } from "../Helpers.js"

export const Triggers = ['reevent', 'revent']

export const run = (_client, _message, _args) => {
  log("Commands reloaded");
  _client._loadEvents();
}