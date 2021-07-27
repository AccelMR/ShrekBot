import fs from "fs";
import path from "path";
import { drive_v3, google } from "googleapis";
import gaxios from "gaxios";

/** Internal imports */
import { log, error } from "./Helpers/helpers";
import { Readable } from "stream";

export class RemoteResources {
  constructor() {}

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
      return error(`Could not load credentials.`);
    }

    //Saves data to this object
    this.CLIENT_ID = CredentialsData.web.client_id;
    this.CLIENT_SECRET = CredentialsData.web.client_secret;
    this.REDIRECT_URI = "https://developers.google.com/oauthplayground";
    this.REFRESH_TOKEN = process.env.REFRESH_TOKEN;
    this.m_folderId = process.env.SOUNDS_FOLDER_ID;

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

  /**
   * Summary. Checks if it has all the audios in the drive folder.
   *
   * @access  public
   *
   * @return {void}
   */
  checkIfNewAudios() {
    this.m_drive?.files
      .list({
        q: `'${this.m_folderId}' in parents and trashed=false`,
      })
      .then((_response) => {
        const Files = _response.data.files;

        this._processFolder(Files);
      });
  }

  /* *********************************************************************** */
  /*                              Private methods                            
  /* *********************************************************************** */

  /**
   * Summary. Executed once we got all the info from the files in a folder.
   *
   * @access  private
   *
   * @return {void}
   */
  _processFolder(_files: drive_v3.Schema$File[] | undefined) {
    const Files = _files;
    //const SoundsPath =

    if (Files === undefined) {
      return error("Didn't get any Files in processFolder()");
    }

    for (const _file of Files) {
      const FullPath = `${process.env.SOUND_LOCAL_PATH}${_file.name}`;

      //log(`File =>`, _file);

      //check if the file exist otherwise download it
      try {
        const stats = fs.statSync(FullPath);
        //log(`Stats => `, stats);
      } catch (_err) {
        this._downloadAudio(FullPath, _file);
      }
    }
  }

  /**
   * Summary. Async. Downloads the audio to local pc
   *
   * @access  private
   *
   * @return {void}
   */
  async _downloadAudio(_path: string, _file: drive_v3.Schema$File) {
    let sound = fs.createWriteStream(_path);
    const response = await this.m_drive?.files.get(
      {
        fileId: _file.id,
        alt: "media",
      },
      { responseType: "stream" }
    );

    const streamy = response?.data as Readable;
    await streamy.pipe(sound);

    log(`File downloaded =>`, _file);
  }

  /* *********************************************************************** */
  /*                              members                            
  /* *********************************************************************** */

  /**
   * Drive Folder Id.
   *
   * @access private
   *
   * @member   {string} m_folderId
   * @memberof remoteResources
   */
  private m_folderId: string | undefined = "";

  /**
   * Reference to the drive object.
   *
   * @access private
   *
   * @member   {drive_v3.Drive} m_drive
   * @memberof remoteResources
   */
  private m_drive: drive_v3.Drive | undefined;

  /**
   * OAuth2 from google.
   *
   * @access private
   *
   * @member   {any} m_oauth2
   * @memberof remoteResources
   */
  private m_oauth2: any;

  //Here are all the credentials needed. All of them are Strings and come from
  //the /resources/credentials/driveCredentials.json
  private CLIENT_ID: string | undefined = "";
  private CLIENT_SECRET: string | undefined = "";
  private REDIRECT_URI: string | undefined = "";
  private REFRESH_TOKEN: string | undefined = "";
}
