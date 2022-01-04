//call and initialize env variables
import { config } from "dotenv";
config();

/* External imports */
import { Client, Intents, Message, Collection } from "discord.js";
import decache from "decache";

import * as path from "path";
import * as fs from "fs";

/** Internal imports */
import { log, error, warning } from "./Helpers/helpers";
import { ResourceManager } from "./resourceManager";


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

    //Save managers
    this.m_resourceManager = new ResourceManager();
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
  initialize()
  {
    //Create discord Client
    this.m_bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES] });

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
    if (!FolderExists) { error(`${FullPath} does not exist.`); return; }

    const FolderFiles = fs.readdirSync(FullPath);

    for (const File of FolderFiles)
    {
      const FilePath = `${FullPath}/${File}`;
      decache(FilePath);
      import(FilePath).then((_fileEvent) =>
      {
        let EventName = File.split(".")[0];
        this.m_bot?.on(EventName, _fileEvent.event.bind(null, this));
        log(`Loaded [${EventName}] event`);
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
  loadCommands() {
    this.m_commands.clear();

    const CommandsPath = "./commands/";
    const FullPath = path.resolve(__dirname, CommandsPath);

    const FolderExists = fs.existsSync(FullPath);
    if (!FolderExists) { error(`${FullPath} does not exist.`); }

    const FolderFiles = fs.readdirSync(FullPath);

    for (const File of FolderFiles)
    {
      const FilePath = `${FullPath}/${File}`;
      decache(FilePath); 
      import(FilePath).then((_fileCommand) => {
        let CommandTriggers: string[] = _fileCommand.Triggers;

        for (const Trigger of CommandTriggers) {
          this.m_commands.set(Trigger, _fileCommand.run);
        }

        log(`Loaded [${File}] file as command`);
      });
    }
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
  get Commands(){
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
  private m_commands: Collection<string, (_client: ShrekBot, _message: Message, _args: string[])=>{}>;

}