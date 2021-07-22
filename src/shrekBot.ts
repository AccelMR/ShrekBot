//call and initialize env variables
import { config } from "dotenv";
config();

/* External imports */
import Discord from "discord.js";
import decache from "decache";

import * as path from "path";
import * as fs from "fs";

/** Internal imports */
import { log, error } from "./Helpers/helpers";

//Interface of how the Resource Manager should be handled
export interface ResourceManager {
  [key: string]: Record<string, any>;
}
export class ShrekBot {
  constructor() {}

  /* *********************************************************************** */
  /*                              Public                            
  /* *********************************************************************** */

  initialize() {
    //Create discord Client
    this.m_bot = new Discord.Client();

    const jsonPath = "../../resources/json/";
    this.m_jsonFullPath = path.resolve(__dirname, jsonPath);

    //Load any other resource needed
    this.loadResourceManagerData();

    //Load commands and events for the first time
    this._loadEvents();
    this.loadCommands();

    //Client login
    this.m_bot.login(process.env.TOKEN);
  }

  /* *********************************************************************** */
  /*                            Private Functions                            
  /* *********************************************************************** */

  /**
   * Summary. Load all commands.
   *
   * Description. If commands are loaded already, It'll create a symlink to commands to reload them
   *
   * @access  public
   *
   * @return {void}
   */
  loadCommands() {
    this.m_commands = new Discord.Collection();

    const CommandsPath = "./commands/";
    const FullPath = path.resolve(__dirname, CommandsPath);

    fs.readdir(FullPath, (err, files) => {
      if (err) return console.error(err);

      files.forEach((file) => {
        const FilePath = `${FullPath}/${file}`;
        decache(FilePath);
        import(FilePath).then((_fileCommand) => {
          let commandTriggers: string[] = _fileCommand.Triggers;

          commandTriggers.forEach((_trigger) => {
            this.m_commands.set(_trigger, _fileCommand.run);
          });

          log(`Loaded ${file} file as command`);
        });
      });
    });
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
  _loadEvents(): void {
    // var _this = this;
    this.m_bot.removeAllListeners();

    const EventsPath = "./events/";
    const FullPath = path.resolve(__dirname, EventsPath);

    fs.readdir(FullPath, (err, files) => {
      if (err) return console.error(err);

      files.forEach((file) => {
        const FilePath = `${FullPath}/${file}`;
        decache(FilePath);
        import(FilePath).then((_fileEvent) => {
          let eventName = file.split(".")[0];
          this.m_bot.on(eventName, _fileEvent.event.bind(null, this));
          log(`Loaded ${eventName} event`);
        });
      });
    });
  }

  /**
   * Summary. Loads any other resource data.
   *
   * @access  public
   *
   * @return {void}
   */
  loadResourceManagerData(): void {
    this.m_resourceManager = new Object() as ResourceManager;

    fs.readdir(this.m_jsonFullPath, (_err, _files) => {
      if (_err) return error(_err);

      _files.forEach((file) => {
        const fileName: string = file.substr(0, file.lastIndexOf("."));

        this.m_resourceManager[fileName] = JSON.parse(
          fs.readFileSync(`${this.m_jsonFullPath}/${file}`, "utf8")
        );

        log(
          `Loaded ${file} in Resource Manager with data =>`,
          this.m_resourceManager[fileName]
        );
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
  getJSON(_name: string): Record<string, any> {
    if (_name in this.m_resourceManager) {
      return this.m_resourceManager[_name];
    }

    const message = `Theres no ${_name} in Resource Manager.`;
    log(message);
    return { ["error"]: message };
  }

  /**
   * Summary. Returns the Discord Client.
   *
   * @access  public
   *
   * @return {Discord.Client} Discord Client initialized
   */
  get Bot() {
    return this.m_bot;
  }

  /**
   * Summary. Returns all the commands attached with this Bot.
   *
   * @access  public
   *
   * @return {Discord.Collection<string, Function>} collection of commands
   */
  get Commands() {
    return this.m_commands;
  }

  /**
   * Summary. Returns the config from resource manager.
   *
   * @access  public
   *
   * @return {Record<string, any>} config Object
   */
  get Config(): Record<string, any> {
    return this.getJSON("config");
  }

  /* *********************************************************************** */
  /*                              Properties                            
  /* *********************************************************************** */

  /**
   * Discord Client for shrek bot.
   *
   * @access private
   *
   * @member   {Discord.Client} m_bot
   * @memberof ShrekBot
   */
  private m_bot: Discord.Client = null;

  /**
   * Resource Manager that saves all the json's in resources/additional/   Path.
   *
   * @access private
   *
   * @member   {ResourceManager} m_resourceManager
   * @memberof shrekBot
   */
  private m_resourceManager: ResourceManager;

  /**
   * How many times evens have laoded.
   *
   * @access private
   *
   * @member   {int} m_eventReloadedI
   * @memberof shrekBot
   */
  private m_eventReloadI: number = 0;

  /**
   * How many times commands have loaded.
   *
   * @access private
   *
   * @member   {int} m_commandReloadI
   * @memberof shrekBot
   */
  private m_commandReloadI: number = 0;

  /**
   * All the commands this bot can execute.
   *
   * @access private
   *
   * @member   {Discord.Collection<string, Function>} Commands
   * @memberof shrekBot
   */
  private m_commands: Discord.Collection<string, Function>;

  /**
   * Full path where jsons are saved.
   *
   * @access private
   *
   * @member   {string} jsonFullPath
   * @memberof shrekBot
   */
  private m_jsonFullPath: string = "";
}
