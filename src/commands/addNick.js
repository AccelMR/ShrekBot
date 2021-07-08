import * as fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

//Own Modules
import { log } from "../Helpers.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const Triggers = ['addnick', 'newnick']

export const run = (_client, _message, _args) => {
  let Channel = _message.channel;

  //Delete this command
  _message.delete();

  //If not arguments were send
  if (!_args || _args.length !== 2) {
    let message = `I didn't even get arguments, noob.`;
    Channel.send(message);
    log('No args were send');
    return;
  }

  let NicksData = _client.getJSON("nicks");
  //Nicks only can be saved with lower case
  let Nick = _args[0].toLowerCase();
  let RealName = _args[1];

  //If nick already exist then it'll return
  if (Nick in NicksData) {
    let message = `${Nick} exists already in the nicks for ${NicksData[Nick]}`;
    Channel.send(message);
    log(message);
    return;
  }

  //If user sends another nick as the main nick
  if(RealName in NicksData){
    RealName = NicksData[RealName];
  }

  //Adds it to the nick data and also writes it to the data file
  NicksData[Nick] = RealName;
  fs.writeFile(
    path.resolve(__dirname, `../../resources/additional/nicks.json`),
    JSON.stringify(NicksData),
    function writeJSON(_err) {
      if (_err) return error(_err);
    });

  log(`${RealName} has new Nick ${Nick}`);
}