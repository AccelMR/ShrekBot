import { getFormatTime } from "./helpers";
import * as fs from "fs";

enum LogType
{
    INFO,
    ERROR,
    WARNING
}

export class ShrekLogger
{
    /**
     * Summary. Constructor.
     * 
     * @param _loggerName The name of this new Logger.
     */
    constructor(_loggerName: string) 
    {
        this.m_loggerName = _loggerName;
    }

    log(_message: string)
    {
        this._internalLog(_message, LogType.INFO);

        if (this.m_debugMode)
        {
            const DateStyle = "color: #ffffff";
            const DateInfo = `${getFormatTime()}\tINFO`;
            console.log(`%c${DateInfo}`, DateStyle, _message);
        }

    }


    error(_message: string)
    {
        this._internalLog(_message, LogType.ERROR);

        if (this.m_debugMode)
        {
            const DateStyle = "color: #ff00ff";
            const DateInfo = `${getFormatTime()}\tWARNING`;
            console.error(`%c${DateInfo}`, DateStyle, _message);
        }
    }

    warning(_message: string)
    {
        this._internalLog(_message, LogType.WARNING);

        if (this.m_debugMode)
        {
            const DateStyle = "color: #bada55";
            const DateInfo = `${getFormatTime()}\tERROR`;
            console.warn(`%c${DateInfo}`, DateStyle, _message);
        }
    }


    /**
     * Summary. Forces a save of the current logger.
     * @returns Void
     */
    forceSave()
    {
        const LoggerPath = `${process.env.LOGGER_PATH}${this.m_loggerName}.txt`;
        if (!LoggerPath) { return; }

        const MessageSingleLine = this.m_log.join("\n");

        fs.writeFileSync(LoggerPath, MessageSingleLine);

        //clear the logger
        this.m_log = [];
    }

    /**
     * Summary. Internal log.
     * 
     * @param _message The message to be logged.
     */
    private _internalLog(_message: string, _type: LogType)
    {
        const TypeName = _type.toString();
        const DateInfo = getFormatTime();
        const FixedMessage = `${DateInfo}\t[${TypeName}]\t${_message}`;

        this.m_log.push(FixedMessage);

        //Every 10 loggs we write it to the file and clear the array to keep low memory.
        if (this.m_log.length === this.m_timesToSave)
        {
            this.forceSave();
        }
    }

    /**
     * Properties
     */

    private m_loggerName: string;

    private m_debugMode: boolean = true;

    private m_log: string[] = [];

    private m_timesToSave: number = 10;
}