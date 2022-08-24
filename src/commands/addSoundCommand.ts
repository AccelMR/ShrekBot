/**
 * @Description Add sound to Guild command.
 *
 * @author Accel Magaña Rodriguez. <accel.mr@gmail.com>
 */

/* External imports */
import Discord, { TextChannel } from "discord.js";
import fs from "fs";
import { BaseCommand, ParameterDetails } from "../Helpers/baseCommand";

/** Own modules  */
import { checkParamLenght, getMemberByUserOrNickName } from "../Helpers/discordHelper";
import { soundExist } from "../Helpers/helpers";
import { ShrekBot } from "../shrekBot";

/**
 * Add sound command.
 */
export class AddSoundCommand implements BaseCommand
{
  /**
   * Descriptor members.
   */
  Triggers: string[] = ["addsound"];
  Summary: string = `Adds joining sound to given player for this server.`;
  Description: string = "Adds joining sound to given player. That sound must be in the sounds folder.";
  Params: ParameterDetails[] =
    [
      {
        Name: "UserName",
        Type: "string",
        Optional: false,
        Default: "N/A",
        Description: "The Username|Nick name|User id of the player that the sound will be attached."
      },
      {
        Name: "Sound Name",
        Type: "string",
        Optional: false,
        Default: "N/A",
        Description: "The name of the sound to be added. This sound must be in the Sounds folder and it has to be .mp3 in order to work."
      },
      {
        Name: "Server Name",
        Type: "string",
        Optional: true,
        Default: "Default",
        Description: `The name of the server where the sound will play,\
         if null then the sound will play in the server were this command was invoked.\
         If you want the same sound for all the servers if it is not overrided then send "default"`
      }
    ];
  Example: string = 'addsound accel soundName';

  /**
   * The actual execution of the command.
   * @param _client The actual shrekBot.
   * @param _message message command.
   * @param _args Parameters
   * @returns void
   */
  run(_client: ShrekBot, _message: Discord.Message<boolean>, _args: string[])
  {
    const resourceManager = _client.ResMng;
    const Guild = _message.guild;
    if (!Guild) { return; }
    const GuildID = Guild.id;
    const SoundData = resourceManager.getJSON("sounds");
    const Default = "default";
    const UserName = _message.member?.user.username ?? "";
    const TexChannel = _message.channel;

    //Check if arguments are correct.
    if (!checkParamLenght(_args, this.Params))
    {
      const Parameters = _args.join(`, `);
      _client.errorIntoGuildFile(GuildID, `Invoker: ${UserName}. Missing arguments in ${this.Triggers[0]}(). Params: [${Parameters}]`);
      return;
    }

    //Delete this command
    _message.delete();

    //Look for the given name.
    const MemberToAddSound = getMemberByUserOrNickName(_args[0].toLowerCase(), Guild, _client);
    if (!MemberToAddSound)
    {
      _client.errorIntoGuildFile(GuildID, `${UserName} tried to add ${_args[0]} but was not found in any DB.`);
      return;
    }
    
    //Get the userID
    const UserID = MemberToAddSound.user.id;

    //If This person has no field yet, it creates it
    if (!(UserID in SoundData))
    {
      SoundData[UserID] = {};
    }

    const UserObj = SoundData[UserID];
    let Args = !(Default in UserObj) ? Default : _args[2];
    
    const GuildIDToAdd = Args ?? GuildID;

    //Get the sound Name
    const SoundName = _args[1];
    if (!soundExist(SoundName))
    {
      _client.errorIntoGuildFile(GuildID, `${SoundName} does not exist in Sounds folder.`);
      TexChannel.send(`<@${_message.member?.id}> Mi wen, ese sonido no está en la carpeta`);
      return;
    }

    if(SoundName.includes(".mp3")){
      SoundName.replace(".mp3", '');
    }

    UserObj[GuildIDToAdd] = SoundName.toLocaleLowerCase();

    //Save to the file async.
    fs.writeFileSync(
      `${process.env.JSON_PATH}sounds.json`,
      JSON.stringify(SoundData)
    );

    const GuildStr = GuildIDToAdd === GuildID ? Guild.name : GuildIDToAdd;
    _client.logIntoGuildFile(GuildID, `Added ${SoundName}.mp3 to ${MemberToAddSound.user.username} in ${GuildStr}`);
    TexChannel.send(`<@${UserID}> Tienes nuevo audio xd ${SoundName}`);
  }
}

/**
 * Creates Command Reference since it can't be created outside if it is dynamc.
 * @returns AdNickCommand reference
 */
export function createCommand(): BaseCommand
{
  return new AddSoundCommand();
}