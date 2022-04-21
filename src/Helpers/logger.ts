import { getFormatDate, getFormatTime } from "./helpers";
import * as fs from "fs";

enum LogType
{
    INFO = "INFO",
    ERROR = "ERROR",
    WARNING = "WARNING"
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

        this.m_loggerPath = __dirname + `${process.env.LOGGER_PATH}${this.m_loggerName}_${getFormatDate()}.txt`;
    }

    log(_message: string)
    {
        this._internalLog(_message, LogType.INFO);

        if (this.m_debugMode)
        {
            const DateStyle = "color: #FFFFFF";
            const DateInfo = `${getFormatTime()}\tINFO`;
            console.log(`%c[${DateInfo}]`, DateStyle, _message);
        }

    }


    error(_message: string)
    {
        this._internalLog(_message, LogType.ERROR);

        if (this.m_debugMode)
        {
            const DateStyle = "color: #FF0000";
            const DateInfo = `${getFormatTime()}\tERROR`;
            console.error(`%c[${DateInfo}]`, DateStyle, _message);
        }
    }

    warning(_message: string)
    {
        this._internalLog(_message, LogType.WARNING);

        if (this.m_debugMode)
        {
            const DateStyle = "color: #FFFF00";
            const DateInfo = `${getFormatTime()}\tWARNING`;
            console.warn(`%c[${DateInfo}]`, DateStyle, _message);
        }
    }


    /**
     * Summary. Forces a save of the current logger.
     * @returns Void
     */
    forceSave()
    {
        const MessageSingleLine = this.m_log.join("\n") + "\n";

        try
        {
            fs.appendFileSync(this.m_loggerPath, MessageSingleLine,
                { encoding: "utf8", flag: "w"});
        } catch (err)
        {
            console.error(err);
        }

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
        const FixedMessage = `[${DateInfo}]\t[${TypeName}]\t${_message}`;

        this.m_log.push(FixedMessage);

        //Every 10 loggs we write it to the file and clear the array to keep low memory.
        if (this.m_log.length === this.m_timesToSave)
        {
            this.forceSave();
        }
    }

    /**
     * Return the path of this logger.
     */
    get LoggerPath()
    {
        return this.m_loggerPath;
    }

    /**
     * Properties
     */

    private m_loggerName: string;

    private m_debugMode: boolean = true;

    private m_log: string[] = [];

    private m_timesToSave: number = 3;

    private m_loggerPath: string;
}