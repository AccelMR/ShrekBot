export function log(..._message: any[]): void {
  let args = Array.prototype.slice.call(_message);
  args.unshift(getFormatTime() + " ");
  console.log.apply(console, args);
}

export function error(_message: any) {
  let args = Array.prototype.slice.call(_message);
  args.unshift(getFormatTime() + " ");
  console.error.apply(console, args);
}

/**
 * Summary. Gives Time as [day-month-year_hours:minutes].
 *
 * @access  public
 *
 * @return {string} Returns the current time formatted
 */
export function getFormatTime(): string {
  let date_ob = new Date();
  // current date
  // adjust 0 before single digit date
  let day = ("0" + date_ob.getDate()).slice(-2);

  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  // current year
  let year = date_ob.getFullYear();

  // current hours
  let hours = date_ob.getHours();

  // current minutes
  let minutes = date_ob.getMinutes();

  // current seconds
  //let seconds = date_ob.getSeconds();

  return "[" + day + "-" + month + "-" + year + "_" + hours + ":" + minutes + "]";
}

// Checks if string can be converted to int if Nan is found then it'll return
// a default value. Default = 0
export function getInteger(_stringVal: string, _default = 0): number {
  let intValue = parseInt(_stringVal);
  return isNaN(intValue) ? _default : intValue;
}

/* *********************************************************************** */
/*                            Typescript helpers                            
/* *********************************************************************** */
declare global {
  interface Number {
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
Number.prototype.clamp = function (min: number, max: number): number {
  return Math.min(Math.max(this.valueOf(), min), max);
};
