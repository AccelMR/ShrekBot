/** External modules */
import * as path from "path";
import * as fs from "fs";

/** Own modules */
import { log, error } from "./Helpers/helpers";

//Interface of how the Resource Manager should be handled
export interface Resource
{
  [key: string]: Record<string, any>;
}

/**
  * Summary. Resource Manager class
  *
  * Description. Where all resources are loaded and saved.
  */
export class ResourceManager
{
  constructor()
  {
    //Get full path to where json are
    this.m_jsonResourcesPath = path.resolve(__dirname, "../resources/json/");

    this.m_resourceManager = new Object() as Resource;
  }

  /**
   * Summary. Initialize REsource Manager.
   *
   * @access  public
   *
   * @return {void}
   */
  initialize(): void
  {
    this.loadResourceManagerData();
  }

  /**
   * Summary. Loads any other resource data.
   *
   * @access  public
   *
   * @return {void}
   */
  loadResourceManagerData()
  {
    const FullPath = this.m_jsonResourcesPath;
    const FolderExists = fs.existsSync(FullPath);
    if (!FolderExists) { error(`${FullPath} does not exist.`); return; }

    const FolderFiles = fs.readdirSync(FullPath);

    for (const File of FolderFiles)
    {
      // If file is not a json file we ignore it.
      if (!File.endsWith(".json")) { continue; }

      const FileName = File.replace(/\.[^/.]+$/, "");
      this.m_resourceManager[FileName] = JSON.parse(
        fs.readFileSync(`${this.m_jsonResourcesPath}/${File}`, "utf8")
      );

      log(`Loaded [${FileName}] in Resource Manager`);
    }
  }

  /* *********************************************************************** */
  /*                              Getters                            
  /* *********************************************************************** */

  /**
   * Summary. Returns the config from resource manager.
   *
   * @access  public
   *
   * @return {Record<string, any>} config Object
   */
  get Config(): Record<string, any>
  {
    return this.getJSON("config");
  }

  /**
   * Summary. returns the data loaded from json in resources.
   *
   * @access  public
   *
   * @return {JSON} The Data loaded from given name. Null if name does not exist
   */
  getJSON(_name: string): Record<string, any>
  {
    if (_name in this.m_resourceManager)
    {
      return this.m_resourceManager[_name];
    }

    const message = `Theres no ${_name} in Resource Manager.`;
    error(message);
    return { ["error"]: message };
  }

  /* *********************************************************************** */
  /*                              Members                            
        /* *********************************************************************** */

  /**
   * Full path where json are saved.
   *
   * @access private
   *
   * @member   {string} m_jsonFullPath
   * @memberof shrekBot
   */
  private m_jsonResourcesPath: string = "";

  /**
   * Resource Manager that saves all the json in resources/additional/   Path.
   *
   * @access private
   *
   * @member   {ResourceManager} m_resourceManager
   * @memberof shrekBot
   */
  private m_resourceManager: Resource;
}
