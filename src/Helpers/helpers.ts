import * as fs from "fs";
import * as request from "request";

function zeroPad(nr: Number, base: Number){
  var  len = (String(base).length - String(nr).length)+1;
  return len > 0? new Array(len).join('0')+nr : nr;
}

/**
 * Summary. Gives Time as [day-month-year_hours:minutes].
 *
 * @access  public
 *
 * @return {string} Returns the current time formatted
 */
export function getDateTimeFormat(): string
{

  return (`${getDateFormat()}_${getTimeFormat()}`);
}

/**
 * Summary. Gives Time as [day-month-year].
 *
 * @access  public
 *
 * @return {string} Returns the current time formatted
 */
 export function getDateFormat(): string
 {
   const date_ob = new Date();
   // current date
   // adjust 0 before single digit date
   const day = ("0" + date_ob.getDate()).slice(-2);
 
   // current month
   const month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
 
   // current year
   const year = date_ob.getFullYear();
 
   return (`${day}-${month}-${year}`);
 }

 /**
 * Summary. Gives Time as [hours:minutes].
 *
 * @access  public
 *
 * @return {string} Returns the current time formatted
 */
  export function getTimeFormat(): string
  {
    const date_ob = new Date();

    // current hours
    const hours = date_ob.getHours();

    // current minutes
    const minutes = zeroPad(date_ob.getMinutes(), 10);

    const seconds = zeroPad(date_ob.getSeconds(), 10);

    return (`${hours}:${minutes}:${seconds}`);
  }

// Checks if string can be converted to int if Nan is found then it'll return
// a default value. Default = 0
export function getInteger(_stringVal: string, _default = 0): number
{
  let intValue = parseInt(_stringVal);
  return isNaN(intValue) ? _default : intValue;
}

/* *********************************************************************** */
/*                            Typescript helpers                            
/* *********************************************************************** */
declare global
{
  interface Number
  {
    clamp: (min: number, max: number) => number;
  }
}

/**
 * Returns a number whose value is limited to the given range.
 *
 * Example: limit the output of this computation to between 0 and 255
 * (x * 255).clamp(0, 255)
 *
 * @param {Number} min The lower boundary of the output range
 * @param {Number} max The upper boundary of the output range
 * @returns A number in the range [min, max]
 * @type Number
 */
Number.prototype.clamp = function (min: number, max: number): number
{
  return Math.min(Math.max(this.valueOf(), min), max);
};

/**
 * Summary. Checks if the sound exist in sound folder.
 * 
 * @param _soundName Sound name.
 * @returns {boolean}
 */
export function soundExist(_soundName: string): boolean
{
  const Ext = _soundName.endsWith(`.mp3`) ? "" : ".mp3";  
  const Path = `${process.env.SOUND_LOCAL_PATH}${_soundName}${Ext}`;
  console.log("------------------->" + Path); 
  return fs.existsSync(Path);
}

export function downloadFromURL(_url: string, _fileNameExt: string, _callback?: () => any)
{
  const curr = request.get(_url);
  curr.on('error', console.error)
  curr.pipe(fs.createWriteStream(`${process.env.SOUND_LOCAL_PATH}${_fileNameExt.toLocaleLowerCase()}`));
  if(_callback){
    curr.on('end', _callback);
  }
}
