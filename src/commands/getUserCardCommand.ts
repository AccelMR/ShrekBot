/**
 * @Description Creates a user's card that can interact.
 *
 * @author Accel Magaña Rodriguez. <accel.mr@gmail.com>
 */


import { BaseCommand, ParameterDetails } from "../Helpers/baseCommand";
import { ShrekBot } from "../shrekBot";
import Discord, { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { checkParamLenght, getMemberByUserOrNickName } from "../Helpers/discordHelper";
import { playSoundFromFile } from "../Helpers/discordHelper";
import { soundExist } from "../Helpers/helpers";

 
/**
 * Add sound command.
 */
export class UserCardCommand implements BaseCommand
{
   /**
   * Descriptor members.
   */
  Triggers: string[] = ["getuserdata", "getusr", "usr"];
  Summary: string = `Creates a message with all the information of a specific user through all the servers.`;
  Description: string = "This command will show all the related information and resources of a user. \
  It'll also contain a number of buttons that other users can interact to.";
  Params: ParameterDetails[] =
    [
      {
        Name: "UserName",
        Type: "string",
        Optional: false,
        Default: "N/A",
        Description: "The Username|Nick name|User id of the user."
      },
      {
        Name: "Full Info",
        Type: "boolean",
        Optional: true,
        Default: "false",
        Description: "If you want all the related data of a user instead of just the guild one."
      }
    ];
  Example: string = 'getusr UserID';

  /**
    * The actual execution of the command.
    * @param _client The actual shrekBot.
    * @param _message message command.
    * @param _args Parameters
    * @returns void
   */
     run(_client: ShrekBot, _message: Discord.Message<boolean>, _args: string[])
     {
        checkParamLenght(_args, this.Params);
        const Channel = _message.channel;
        const Guild = _message.guild;
        if (!Guild) { return; }
        const GuildID = Guild.id;
        const User = getMemberByUserOrNickName(_args[0].toLowerCase(), Guild, _client)?.user;
        if (!User) { return; }
        const UserID = User.id;
        const UserName = User.username;
        const MsgRow = new MessageActionRow();    
        const Default = "default";
        const ParamFull: boolean | string = _args[1] ?? false;
        const FullData = ParamFull ?? true;

        const PRIMARY = "PRIMARY";

        const SoundDefaultButton = new MessageButton();
        SoundDefaultButton.setStyle(PRIMARY);
        SoundDefaultButton.setCustomId(`Sound-${UserID}-${Default}`);
        SoundDefaultButton.setLabel('Sound default');

        const Resmngr = _client.ResMng;
        const SoundsData = Resmngr.getJSON("sounds");
        const NicksData = Resmngr.getJSON("nicks");
        const WhiteListData = Resmngr.getJSON("whitelist");
        const UsrData = SoundsData[UserID];
        if(!UsrData) { 
            console.log("äsdasdas");
            return; }

        if(FullData){
            //DO
        }

        if(GuildID in UsrData){
            const GuildSound = new MessageButton(); 
            GuildSound.setStyle(PRIMARY);
            GuildSound.setCustomId(`Sound-${UserID}-${GuildID}`);
            GuildSound.setLabel(`Sound ${Guild.name}`);   
            MsgRow.addComponents(GuildSound);         
        }      

        MsgRow.addComponents(SoundDefaultButton);

        const MsgEmb = new MessageEmbed();
        MsgEmb.setTitle(User.username);
        MsgEmb.addField(`User Id: `, User.id);
        
        const Nicks = []
        for(const nick in NicksData)
        {
            if(UserID === NicksData[nick]){
                Nicks.push(nick);
            }
        }
 
        if(Nicks.length !== 0){
            MsgEmb.addField(`Nicks: `, Nicks.join(", "));
        }

        const InvulnerabilityList = [];
        for(const typeWL in WhiteListData) {
            const WhitelistedPeople: string[] = WhiteListData[typeWL];
            if(WhitelistedPeople.includes(UserID)){
                InvulnerabilityList.push(typeWL);
            }
        }

        const AddNickBtn = new MessageButton(); 
        AddNickBtn.setStyle("SECONDARY");
        AddNickBtn.setCustomId(`Addnick-${UserID}`);
        AddNickBtn.setLabel(`Add Nick`);   
        MsgRow.addComponents(AddNickBtn);            
        
        const DiscBtn = new MessageButton(); 
        DiscBtn.setStyle("DANGER");
        DiscBtn.setCustomId(`Disc-${UserID}`);
        DiscBtn.setLabel(`Disc ${UserName}`);   
        MsgRow.addComponents(DiscBtn);   

        if(InvulnerabilityList.length !== 0){
            MsgEmb.addField(`${UserName}'s is invulnerable to : `, InvulnerabilityList.join(", "));
        }

        Channel.send({embeds: [MsgEmb], components: [MsgRow]});
        _message.delete();


     }
}

/**
 * Creates Command Reference since it can't be created outside if it is dynamc.
 * @returns AdNickCommand reference
 */
 export function createCommand(): BaseCommand
 {
   return new UserCardCommand();
 }