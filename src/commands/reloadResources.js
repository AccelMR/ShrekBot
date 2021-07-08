import { log } from "../Helpers.js"

export const Triggers = ['reresources', 'resource', 'loadjson', 'rjson']

export const run = (_client, _message, _args) => {
  //Delete this command
  _message.delete();
  _client.loadResourceManagerData();
  log("Reload Resoruce Manager");
}