/** External modules */
import * as path from "path";
import * as fs from "fs";

/** Own modules */
import { log, error } from "./Helpers/helpers";

//Interface of how the Resource Manager should be handled
export interface Resource {
  [key: string]: Record<string, any>;
}

/**
  * Summary. Resource Manager class
  *
  * Description. Where all resources are loaded and saved.
  */
export class ResourceManager {
  constructor() {
    //Get full path to where json are
    this.m_jsonFullPath = path.resolve(__dirname, "../../resources/json/");

    this.m_resourceManager = new Object() as Resource;
  }

  /**
   * Summary. Initialize REsource Manager.
   *
   * @access  public
   *
   * @return {void}
   */
  initialize(): void {
    this.loadResourceManagerData();
  }

  /**
   * Summary. Loads any other resource data.
   *
   * @access  public
   *
   * @return {void}
   */
  loadResourceManagerData() {
    fs.readdir(this.m_jsonFullPath, (_err, _files) => {
      if (_err) return error(_err);

      _files.forEach((file) => {
        const fileName: string = file.substr(0, file.lastIndexOf("."));

        this.m_resourceManager[fileName] = JSON.parse(
          fs.readFileSync(`${this.m_jsonFullPath}/${file}`, "utf8")
        );

        log(`Loaded [${file}] in Resource Manager`);
      });
    });
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
  get Config(): Record<string, any> {
    return this.getJSON("config");
  }

  /**
   * Summary. returns the data loaded from json in resources.
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
  private m_jsonFullPath: string = "";

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
