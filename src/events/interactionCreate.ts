
import Discord, { ButtonInteraction, Interaction, Message, MessageActionRow, Modal, ModalSubmitInteraction, TextInputComponent } from "discord.js";
import { getMemberByUserOrNickName, playSoundFromFile } from "../Helpers/discordHelper";
import { soundExist } from "../Helpers/helpers";
import { ShrekBot } from "../shrekBot";

const SOUND_TEXT = "Sound";
const DISC_TEXT = "Disc";
const ADDNICK_TEXT = "Addnick";
const RANDISC_TEXT = "randDisc";
const ADDROLE_TEXT = "AddRole";

//When any message is received this gets called
export const event = (_client: ShrekBot, _interaction: Interaction) => {
    if(_interaction.isButton()) {
        HandleButton(_client, _interaction, _interaction.message as Message<boolean>);
    }
    else if(_interaction.isModalSubmit()) {
        const ModalInteraction = _interaction as ModalSubmitInteraction;
        const CustomId = ModalInteraction.customId;
        const Info = CustomId.split("-");
        const newNickInput = _interaction.fields.getTextInputValue(`NewNick`);
        if(newNickInput.length !== 0){
            const Guid = _interaction.guild;
            if(!Guid){return;}
            const Member = getMemberByUserOrNickName(Info[1], _interaction.guild, _client);
            const UserID = Member?.user.id;
            if(!UserID){return;}

            if(_interaction.message)
            {
                _client.triggerCommand("addnick", _interaction.message as Message<boolean>, [newNickInput, Member?.user.id]);
            }
        }

    }
}

function GenerateSoundDb(_client: ShrekBot) : string[] {
    const ResoruceMngr = _client.ResMng;
    const Default = "default";
    const SoundsData = ResoruceMngr.getJSON("sounds");
    if (!SoundsData) {
      return new Array();
    }

    let PossibleKeys = new Array();

    for(const id in SoundsData){
        for(const guildID in SoundsData[id]){
            PossibleKeys.push(`Sound-${id}-${guildID}`);
        }
    }

    return PossibleKeys;
}

function HandleButton(_client: ShrekBot, _interaction: Interaction, _message: Message<boolean>){
    const ButtonInteraction = _interaction as ButtonInteraction;
    const CustomId = ButtonInteraction.customId;
    const GuildId = _interaction.guild?.id;
    if(!GuildId){return;}

    const PossibleKeys = GenerateSoundDb(_client);
    const Info = CustomId.split("-");
    if(!Info) {return;}
    const ButtonType = Info[0];

    if(ButtonType === SOUND_TEXT) {
        if(PossibleKeys.includes(CustomId)){
            Info.shift(); //Remove Sound from array
            if(Info.length < 2){return;}
            const UserID = ButtonType;
            const SoundGuildID = Info[1];

            const PlaySound = () => {
                const ResoruceMngr = _client.ResMng;
                const SoundsData = ResoruceMngr.getJSON("sounds");
                if (!SoundsData)
                {
                  _client.errorIntoGuildFile(SoundGuildID, "Sound Data could not be found.");
                  return;
                }
            
                if (!SoundsData[UserID])
                {
                  _client.warningIntoGuildFile(SoundGuildID, `There is no sound for ${UserID}.`);
                  return;
                }
            
                const Sound = SoundsData[UserID][SoundGuildID] ?? SoundsData[UserID].default;
                if(!soundExist(Sound))
                {
                    console.error(`File ${Sound} does not exist`);
                    _client.errorIntoGuildFile(GuildId, `${Sound} does not exist in Sounds folder`);
                  return;
                }
                const AudioPath = `${process.env.SOUND_LOCAL_PATH}${Sound}.mp3`;
                playSoundFromFile(_client, AudioPath, GuildId);
            }

            PlaySound();
            _message.delete();
        }
    }
    else if(ButtonType === DISC_TEXT) {
        _client.triggerCommand("disc",_message, [Info[1]]);
    }
    else if(ButtonType === ADDNICK_TEXT) {
        const newNickModal = new Modal();
        newNickModal.setCustomId(`NewNickModal-${Info[1]}`)
        newNickModal.setTitle(`Create new nick`);

        const NewNickBox = new TextInputComponent();
        NewNickBox.setStyle("SHORT");
        NewNickBox.setCustomId(`NewNick`);
        NewNickBox.setLabel(`New Nick \n Close after submit`);
        NewNickBox.setMinLength(1);
        
        const firstActionRow = new MessageActionRow<TextInputComponent>();
        firstActionRow.addComponents(NewNickBox);
        newNickModal.addComponents(firstActionRow);
        
        const ModalInt = _interaction as ButtonInteraction;
        ModalInt.showModal(newNickModal);
    }
    else if(ButtonType === RANDISC_TEXT) {
        const TexChannel = _interaction.channel;
        TexChannel?.send(`${_interaction.member?.user.username} clicked on it!`);
        _client.triggerCommand("rd",_message as Message<boolean>, ["nodelete"]);
    }
}