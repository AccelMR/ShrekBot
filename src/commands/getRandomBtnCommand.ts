/**
 * @Description Creates a Button to auto call random disconnect.
 *
 * @author Accel Magaña Rodriguez. <accel.mr@gmail.com>
 */

 import { BaseCommand, ParameterDetails } from "../Helpers/baseCommand";
 import { ShrekBot } from "../shrekBot";
 import Discord, { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
 import { checkParamLenght, getMemberByUserOrNickName } from "../Helpers/discordHelper";

  
/**
 * Add sound command.
 */
export class RandomDiconnectButtonCommand implements BaseCommand
{
   /**
   * Descriptor members.
   */
  Triggers: string[] = ["getrd"];
  Summary: string = `Creates a button that will call random disconnect event.`;
  Description: string = "Creates a button that will call random disconnect event.";
  Params: ParameterDetails[] =
    [];
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
        const TexChannel = _message.channel;
        
        const MsgRow = new MessageActionRow();    

        const AddNickBtn = new MessageButton(); 
        AddNickBtn.setStyle("DANGER");
        AddNickBtn.setCustomId(`randDisc`);
        AddNickBtn.setLabel(`Random Disconnect`);   
        MsgRow.addComponents(AddNickBtn);  

        TexChannel.send({content: ":C", components: [MsgRow]});
     }
}

/**
 * Creates Command Reference since it can't be created outside if it is dynamc.
 * @returns AdNickCommand reference
 */
 export function createCommand(): BaseCommand
 {
   return new RandomDiconnectButtonCommand();
 }
