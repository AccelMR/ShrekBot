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
import { ResourceManager } from "./resourceManager";
import { RemoteResources } from "./remoteResources";

/**
 * Summary. Shrek class where there's all the information needed for the discord client to work
 *
 * Description. This Shrek bot class handles all the global information for events and
 *              commands to work
 */
export class ShrekBot {
  constructor() {
    //Init Commands
    this.m_commands = new Discord.Collection();

    //Save managers
    this.m_resourceManager = new ResourceManager();
    this.m_remoteResources = new RemoteResources();

    this.m_remoteResources.initialize();
    this.m_remoteResources.checkIfNewAudios();
    this.m_resourceManager.initialize();
  }

  /* *********************************************************************** */
  /*                              Public                            
  /* *********************************************************************** */

  /**
   * Summary. Initialize this Shrek bot.
   *
   * @access  public
   *
   * @return {void}
   */
  initialize() {
    //Create discord Client
    this.m_bot = new Discord.Client();

    //Load any other resource needed
    //this.loadResourceManagerData();

    //Load commands and events for the first time
    this.loadEvents();
    this.loadCommands();

    //Client login
    this.m_bot.login(process.env.TOKEN);
  }

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
    this.m_commands.clear();

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

          log(`Loaded [${file}] file as command`);
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
  loadEvents(): void {
    // var _this = this;
    this.m_bot?.removeAllListeners();

    const EventsPath = "./events/";
    const FullPath = path.resolve(__dirname, EventsPath);

    fs.readdir(FullPath, (err, files) => {
      if (err) return console.error(err);

      files.forEach((file) => {
        const FilePath = `${FullPath}/${file}`;
        decache(FilePath);
        import(FilePath).then((_fileEvent) => {
          let eventName = file.split(".")[0];
          this.m_bot?.on(eventName, _fileEvent.event.bind(null, this));
          log(`Loaded [${eventName}] event`);
        });
      });
    });
  }

  /****************************************************************************/
  /*                               Getters      										        	*/
  /****************************************************************************/

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
   * Summary. Returns global resource manager.
   *
   * @access  public
   *
   * @return {ResourceManager} global Resource manager
   */
  get ResMng(): ResourceManager {
    return this.m_resourceManager;
  }

  /**
   * Summary. Returns global Resource Remote Manager.
   *
   * @access  public
   *
   * @return {RemoteResource} the global Remote resource manager
   */
  get RemoteMng(): RemoteResources {
    return this.m_remoteResources;
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
  private m_bot?: Discord.Client;

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
   * Current dispatcher if there's one.
   *
   * @access private
   *
   * @member   {Discord.StreamDispatcher} m_dispatcher
   * @memberof shrekBot
   */
  private m_dispatcher?: Discord.StreamDispatcher;

  //Reference to resource and remote managers
  private m_resourceManager: ResourceManager;
  private m_remoteResources: RemoteResources;
}
