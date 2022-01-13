//call and initialize env variables
import { config } from "dotenv";
config();

/* External imports */
import { Client, Intents, Message, Collection, Guild, Base } from "discord.js";
import decache from "decache";

import * as path from "path";
import * as fs from "fs";

/** Internal imports */
import { ResourceManager } from "./resourceManager";
import { AudioPlayer } from "@discordjs/voice";
import { ShrekLogger } from "./Helpers/logger";
import { BaseCommand } from "./Helpers/baseCommand";


/**
 * Summary. Shrek class where there's all the information needed for the discord client to work
 *
 * Description. This Shrek bot class handles all the global information for events nd
 *              commands to work
 */
export class ShrekBot
{
  // Constructor
  constructor()
  {
    //Init Commands
    this.m_commands = new Collection();
    this.m_Players = new Collection();

    //Save managers
    this.m_resourceManager = new ResourceManager();
    this.m_resourceManager.initialize();

    this.m_loggers = new Map<string, ShrekLogger>();
  }


  /* *********************************************************************** */
  /*                              Public                            
  /* *********************************************************************** */

  /**
   * Summary. Initialize this Shrek bot.
   *
   * @access  public
   * 
   */
  initialize()
  {
    //Create discord Client
    this.m_bot = new Client(
      {
        intents: [
          Intents.FLAGS.GUILDS,
          Intents.FLAGS.GUILD_MESSAGES,
          Intents.FLAGS.GUILD_MEMBERS,
          Intents.FLAGS.GUILD_PRESENCES,
          Intents.FLAGS.GUILD_VOICE_STATES,
        ]
      });

    //Load any other resource needed
    //this.loadResourceManagerData();

    //Load commands and events for the first time
    this.loadEvents();
    this.loadCommands();

    //Client login
    this.m_bot.login(process.env.TOKEN);
  }

  /**
   * Summary. Loads events from event folder.
   * 
   * @access public
   * 
   * @returns {void}
   */
  loadEvents()
  {
    this.m_bot?.removeAllListeners();

    const EventsPath = "./events/";
    const FullPath = path.resolve(__dirname, EventsPath);

    const FolderExists = fs.existsSync(FullPath);
    if (!FolderExists) { console.error(`${FullPath} does not exist.`); return; }

    const FolderFiles = fs.readdirSync(FullPath);

    for (const File of FolderFiles)
    {
      const FilePath = `${FullPath}/${File}`;
      decache(FilePath);
      import(FilePath).then((_fileEvent) =>
      {
        let EventName = File.split(".")[0];
        this.m_bot?.on(EventName, _fileEvent.event.bind(null, this));
        console.log(`Loaded [${EventName}] event`);
      });
    }

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
  loadCommands()
  {
    this.m_commands.clear();

    const CommandsPath = "./commands/";
    const FullPath = path.resolve(__dirname, CommandsPath);

    const FolderExists = fs.existsSync(FullPath);
    if (!FolderExists) { console.error(`${FullPath} does not exist.`); }

    const FolderFiles = fs.readdirSync(FullPath);

    for (const File of FolderFiles)
    {
      const FilePath = `${FullPath}/${File}`;
      decache(FilePath);
      import(FilePath)
        .then((_baseCmdInterface) =>
        {
          try
          {
            const FixedCommand: BaseCommand = _baseCmdInterface.createCommand();
            const CommandTriggers: string[] = FixedCommand.Triggers;
            const FileNoExt = File.split(".")[0];
            for (const Trigger of CommandTriggers)
            {
              this.m_commands.set(Trigger.toLocaleLowerCase(), FixedCommand);
            }

            console.log(`Loaded [${FileNoExt}] file as command`);
          }
          catch (_error)
          {
            console.error(`The Command in [${File}]  does not implement BaseCommand properly.`);
          }
        });
    }
  }

  /**
   * Summary. Adds a Player to given Guild, if a Player already exists then it'll override it.
   * 
   * @param _guildID {string} Guild ID where to save the Player.
   * 
   * @param _player {AudioPlayer} The Player for a Guild to play audios.
   */
  addPlayer(_guildID: string, _player: AudioPlayer)
  {
    if (this.m_Players.has(_guildID))
    {
      console.warn(`This "${_guildID}" already had a Player, a new one was created.`);
    }

    this.m_Players.set(_guildID, _player);
  }

  /**
   * Saummary. Checks if Player exists for this Guild and return it.
   * 
   * @param _guildID {string} The Guild ID where to get the Player.
   * 
   * @returns {AudioPlayer} The found Audio player, undefined if none is found.
   */
  getPlayer(_guildID: string): AudioPlayer | undefined
  {
    if (!this.m_Players.has(_guildID))
    {
      console.warn(`This "${_guildID}" does not have a Player attached.`);
    }

    return this.m_Players.get(_guildID);
  }


  /**
   * 
   * @param _guildID Returns a specific logger if there is one for the guild.
   * @returns ShrekLogger if there is one, undefined if not.
   */
  getLogger(_guildID: string)
  {
    return this.m_loggers.get(_guildID);
  }

  /**
   * Summary. Loggs info into the Guild file.
   * 
   * @param _guildID ID of the guild where the message came from.
   * @param _message Message to be logged.
   * @returns 
   */
  logIntoGuildFile(_guildID: string, _message: string)
  {
    const Logger = this.m_loggers.get(_guildID);
    if (!Logger) { return; }

    Logger.log(_message);
  }

  /**
   * Summary. Loggs errors into the Guild file.
   * 
   * @param _guildID ID of the guild where the message came from.
   * @param _message Message to be logged.
   * @returns 
   */
  errorIntoGuildFile(_guildID: string, _message: string)
  {
    const Logger = this.m_loggers.get(_guildID);
    if (!Logger) { return; }

    Logger.error(_message);
  }

  /**
   * Summary. Loggs warnings into the Guild file.
   * 
   * @param _guildID ID of the guild where the message came from.
   * @param _message Message to be logged.
   * @returns 
   */
  warningIntoGuildFile(_guildID: string, _message: string)
  {
    const Logger = this.m_loggers.get(_guildID);
    if (!Logger) { return; }

    Logger.warning(_message);
  }

  /**
   * Summary. orces to save all loggers.
   */
  forceSaveLoggers()
  {
    for (const [Key, Logger] of this.m_loggers)
    {
      Logger.forceSave();
    }
  }

  /**
   * Summary. DO NOT CALL THIS FUNCTION. This function gets called by a ready event.
   */
  _onBotReady()
  {
    const Guilds = this.Bot?.guilds.cache;
    Guilds?.each(Guild => this._addnewLogger(Guild));
  }


  /****************************************************************************/
  /*                               Private      										        	*/
  /****************************************************************************/
  private _addnewLogger(_guild: Guild)
  {
    this.m_loggers.set(_guild.id, new ShrekLogger(_guild.name));
  }


  /****************************************************************************/
  /*                               Getters      										        	*/
  /****************************************************************************/

  /**
   * Summary. Returns all the commands attached with this Bot.
   *
   * @access  public
   *
   * @return {Discord.Collection<string, Function>} collection of commands
   */
  get Commands()
  {
    return this.m_commands;
  }

  /**
    * Summary. Returns the Discord Client.
    *
    * @access  public
    *
    * @return {Discord.Client} Discord Client initialized
    */
  get Bot()
  {
    return this.m_bot;
  }

  /**
    * Summary. Returns global resource manager.
    *
    * @access  public
    *
    * @return {ResourceManager} global Resource manager
    */
  get ResMng()
  {
    return this.m_resourceManager;
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
  private m_bot?: Client;


  //Reference to resource and remote managers
  private m_resourceManager: ResourceManager;

  /**
   * All the commands this bot can execute.
   *
   * @access private
   *
   * @member   {Discord.Collection<string, (_client: ShrekBot, _message: Message, _args: string[])=>{}>} Commands
   * @memberof shrekBot
   */
  private m_commands: Collection<string, BaseCommand>;

  private m_Players: Collection<string, AudioPlayer>;

  private m_loggers: Map<string, ShrekLogger>;

}