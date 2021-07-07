import { log } from "../Helpers.js"

//Gets called when bot is ready and it's connected to discord api
export const event = (_client, _message) => {
  log("Shrek bot has connected!");
};