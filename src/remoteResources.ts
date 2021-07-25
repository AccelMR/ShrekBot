import fs from "fs";
import path from "path";
import { drive_v3, google } from "googleapis";
import gaxios from "gaxios";

/** Internal imports */
import { log, error } from "./Helpers/helpers";

export namespace RemoteResources {
  class CRemoteResources {
    //TODO: this is nasty and must find a better way to do it.
    //This was made like this because every file needs glbal access to Resources
    //Singleton Static access
    private static _instance: CRemoteResources;
    public static get(){
      if(!CRemoteResources._instance){
        CRemoteResources._instance = new CRemoteResources();
      }
      return CRemoteResources._instance;
    }


    private constructor() {}

    /* *********************************************************************** */
    /*                              Public methods                            
  /* *********************************************************************** */

    initialize() {
      //Load credentials from json
      const CredentialsPath = path.resolve(__dirname, "../../resources/credential/");
      const CredentialFile = "driveCredentials.json";
      const CredentialsData = JSON.parse(
        fs.readFileSync(`${CredentialsPath}/${CredentialFile}`, "utf8")
      );

      if (!CredentialsData) {
        return console.error(`Could not load credentials.`);
      }

      //Saves data to this object
      this.CLIENT_ID = CredentialsData.web.client_id;
      this.CLIENT_SECRET = CredentialsData.web.client_secret;
      this.REDIRECT_URI = "https://developers.google.com/oauthplayground";
      this.REFRESH_TOKEN = process.env.REFRESH_TOKEN;
      this.m_folderId = process.env.SOUND_FOLDER_ID;

      //create Oauth
      this.m_oauth2 = new google.auth.OAuth2(
        this.CLIENT_ID,
        this.CLIENT_SECRET,
        this.REDIRECT_URI
      );

      //Set credentials to be used after this
      this.m_oauth2.setCredentials({ refresh_token: this.REFRESH_TOKEN });

      //Create and stores drive object
      this.m_drive = google.drive({
        version: "v3",
        auth: this.m_oauth2,
      });
    }

    async downloadAudios() {
      await this.m_drive.files.list(
        {
          q: `'${this.m_folderId}' in parents and trashed=false`,
        },
        this.processFolder.bind(this)
      );
    }

    /* *********************************************************************** */
    /*                              Private methods                            
  /* *********************************************************************** */

    async processFolder(
      _error: Error,
      _data: gaxios.GaxiosResponse<drive_v3.Schema$FileList>
    ) {
      if (_error) {
        return error(` Error found getting audio folder ${_error}`);
      }

      const Files = _data.data.files;
      //const SoundsPath =

      Files.forEach((_file) => {
        const FullPath = ``;
        console.log(_file);
        //if(fs.stat())
      });
    }

    /* *********************************************************************** */
    /*                              members                            
  /* *********************************************************************** */

    private m_folderId: String = "";

    private m_drive: drive_v3.Drive;
    private m_oauth2: any;

    private CLIENT_ID: string = "";
    private CLIENT_SECRET: string = "";

    private REDIRECT_URI: string = "";
    private REFRESH_TOKEN: string = "";
  }


  export const Instance = CRemoteResources.get();
}
