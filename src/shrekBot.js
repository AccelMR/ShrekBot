/*
*
* Shrek Bot main class that wrapps all needed stuff from discord to work
*
* @author Accel Magaña accel.mr@gmail.com
*/

import Discord from "discord.js"
import * as fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as Link from "../node_modules/lnk/index.js";
import * as fsExtra from 'fs-extra'

/* Own modules */
import { log, _getInteger, error } from "./Helpers.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class ShrekBot {
  constructor() {
    /**
     * Discord Client ref.
     *
     * @access private
     *
     * @member   {Client} Bot
     * @memberof Shrek Bot
     */
    this.m_bot = null;

    /**
     * Config File.
     *
     * @access private
     *
     * @member   {JSON} Config
     * @memberof shrekBot
     */
    this.m_config = null;

    /**
     * Sounds Json data.
     *
     * @access private
     *
     * @member   {JSON} Sounds
     * @memberof shrekBot
     */
    this.m_soundsData = null;

    /**
     * Emoji Map.
     *
     * @access private
     *
     * @member   {JSON} EmojiMap
     * @memberof shrekBot
     */
    this.m_emojiData = null;

    /**
     * Resource Manager that saves all the json's in resources/additional/   Path.
     *
     * @access private
     *
     * @member   {Object} m_resourceManager
     * @memberof shrekBot
     */
    this.m_resourceManager = null;

    /**
     * How many times evens have laoded.
     *
     * @access private
     *
     * @member   {int} m_eventReloadedI
     * @memberof shrekBot
     */
    this.m_eventReloadI = 0;

    /**
     * How many times commands have loaded.
     *
     * @access private
     *
     * @member   {int} m_commandReloadI
     * @memberof shrekBot
     */
    this.m_commandReloadI = 0;
  }

  /* *********************************************************************** */
  /*                              Public                            
  /* *********************************************************************** */

  /**
   * Summary. initialze all needed stuff for Shrek Bot to work.
   *
   * @access  public
   *
   * @return {void} 
   */
  initialize() {
    //Create discord Client 
    this.m_bot = new Discord.Client();

    //Load Config Data
    this._loadConfig();
    //Load any other resource needed
    this.loadResourceManagerData();

    //Load commands and events for the first time
    this._loadEvents();
    this._loadCommands();

    //Client login
    this.m_bot.login(this.Config.Token);
  }

  /* *********************************************************************** */
  /*                            Private Functions                            
  /* *********************************************************************** */


  /**
   * Summary. Load all commands.
   * 
   * Description. If commands are loaded already, It'll create a symlink to commands to reload them
   *
   * @access  private
   * 
   * @return {void} 
   */
  _loadCommands() {
    var _this = this;

    var symlinkDir = __dirname + `/commandsymlinks${this.m_commandReloadI}/`;

    while (fs.existsSync(symlinkDir)) {
      fsExtra.emptyDirSync(symlinkDir);
      fs.rmdirSync(symlinkDir);

      let oldVal = this.m_commandReloadI;
      this.m_commandReloadI += 1;

      symlinkDir = symlinkDir.replace(oldVal, this.m_commandReloadI);
    }

    this.m_bot.commands = new Discord.Collection();
    fs.readdir("./src/commands/", (_err, _files) => {
      if (_err) return error(_err);

      _files.forEach(file => {
        Link.default(__dirname + `/commands/${file}`, symlinkDir)
          .then(() => {
            import(`./commandsymlinks${this.m_commandReloadI}/${file}`)
              .then(props => {
                for (const keyWordIndx in props.Triggers) {
                  _this.m_bot.commands.set(props.Triggers[keyWordIndx], props.run);
                }
              });
          });
      });
    });

    log(`Loaded commands.`);
  }

  /**
 * Summary. Load all events.
 * 
 * Description. If events are loaded already, It'll create a symlink to events to reload them
 *
 * @access  private
 * 
 * @return {void} 
 */
  _loadEvents() {
    var _this = this;
    this.m_bot.removeAllListeners();

    var symlinkDir = __dirname + `/eventsymlinks${this.m_eventReloadI}/`;

    while (fs.existsSync(symlinkDir)) {
      fsExtra.emptyDirSync(symlinkDir);
      fs.rmdirSync(symlinkDir);

      let oldVal = this.m_eventReloadI;
      this.m_eventReloadI += 1;

      symlinkDir = symlinkDir.replace(oldVal, this.m_eventReloadI);
    }

    fs.readdir("./src/events/", (_err, _files) => {
      if (_err) return error(_err);

      _files.forEach(file => {
        Link.default(__dirname + `/events/${file}`, symlinkDir)
          .then(() => {
            import(`./eventsymlinks${this.m_eventReloadI}/${file}`)
              .then(_fileEvent => {
                let eventName = file.split(".")[0];
                _this.m_bot.on(eventName, _fileEvent.event.bind(null, this));
              });
          })
      });
    });

    log("Loaded Events");
  }

  /**
   * Summary. Loads base config to work.
   *
   * @access  private
   * 
   * @return {void} 
   */
  _loadConfig() {
    this.m_config = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../resources/config.json"), 'utf8', 'utf8'));
    log("Load Config File.")
  }

  /**
   * Summary. Loads any other resource data.
   *
   * @access  public
   * 
   * @return {void} 
   */
  loadResourceManagerData() {
    var _this = this;

    fs.readdir("./resources/additional/", (_err, _files) => {
      if (_err) return error(_err);

      _this.m_resourceManager = new Object();
      _files.forEach(file => {
        let fileName = file.substr(0, file.lastIndexOf('.'));

        _this.m_resourceManager[fileName] = JSON.parse(fs.readFileSync(
          path.resolve(__dirname, `../resources/additional/${file}`), 'utf8', 'utf8'));
        log(`Load ${file} in Resource Manager`)
      });
    });
  }

  /**************************************************************************************************/
  /*                                      Getters																										*/
  /**************************************************************************************************/

  /**
   * Summary. returns the data loaded from json's in resources.
   *
   * @access  public
   * 
   * @return {JSON} The Data loaded from given name. Null if name does not exist
   */
  getJSON(_name) {
    if (_name in this.m_resourceManager) {
      return this.m_resourceManager[_name];
    }

    error(`Theres no ${_name} in Rrsource Manager.`)
    return null;
  }

  get Config() {
    return this.m_config;
  }

  get Bot() {
    return this.m_bot;
  }


}