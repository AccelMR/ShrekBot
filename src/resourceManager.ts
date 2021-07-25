/** External modules */
import * as path from "path";
import * as fs from "fs";

/** Own modules */
import { log, error } from "./Helpers/helpers";

/**
 * Summary. Resource manager global class to have access to global resources
 *
 * Description. Singleton Interface to get access to the Resource Manager class
 */
export namespace ResourceManager {
  
  //Interface of how the Resource Manager should be handled
  export interface Resource {
    [key: string]: Record<string, any>;
  }

  class CResourceManager {
    //TODO: this is nasty and must find a better way to do it.
    //This was made like this because every file needs glbal access to Resources
    //Singleton Static access
    private static _instance: CResourceManager;
    public static get(){
      if(!CResourceManager._instance){
        CResourceManager._instance = new CResourceManager();
      }
      return CResourceManager._instance;
    }

    private constructor() {
      //Get full path to where jsons are
      this.m_jsonFullPath = path.resolve(__dirname, "../../resources/json/");
    }

    /**
     * Summary. Intialize REsource Manager.
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
      this.m_resourceManager = new Object() as Resource;

      fs.readdir(this.m_jsonFullPath, (_err, _files) => {
        if (_err) return error(_err);

        _files.forEach((file) => {
          const fileName: string = file.substr(0, file.lastIndexOf("."));

          this.m_resourceManager[fileName] = JSON.parse(
            fs.readFileSync(`${this.m_jsonFullPath}/${file}`, "utf8")
          );

          log(
            `Loaded [${file}] in Resource Manager with data =>`,
            this.m_resourceManager[fileName]
          );
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

    /* *********************************************************************** */
    /*                              Members                            
        /* *********************************************************************** */

    /**
     * Full path where jsons are saved.
     *
     * @access private
     *
     * @member   {string} m_jsonFullPath
     * @memberof shrekBot
     */
    private m_jsonFullPath: string = "";

    /**
     * Resource Manager that saves all the json's in resources/additional/   Path.
     *
     * @access private
     *
     * @member   {ResourceManager} m_resourceManager
     * @memberof shrekBot
     */
    private m_resourceManager: Resource;
  }


  export const Instance = CResourceManager.get();
}
