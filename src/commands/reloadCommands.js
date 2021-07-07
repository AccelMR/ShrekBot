import { log } from "../Helpers.js"

export const Triggers = ['recmd', 'rcmd']

export const run = (_client, _message, _args) => {
  log("Commands reloaded")
  _message.delete();
  _client._loadCommands();
}