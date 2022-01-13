import Discord from "discord.js";
import { ShrekBot } from "../shrekBot";

/**
 * Base class to be used for every new command. 
 * This simplifies and forces the programmer to folow Shhrek standar.
 */
export interface BaseCommand
{
    //Properties
    Triggers: string[];
    Summary: string;
    Description: string;
    Params: ParameterDetails[];
    Example: string;

    run: (_client: ShrekBot, _message: Discord.Message, _args: string[]) => void;

}

export interface ParameterDetails
{
    Name: string;
    Type: "string" | "number" | "boolean" | "mp3";
    Optional: boolean;
    Default: string;
    Description: string;
}