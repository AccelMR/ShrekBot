

export const log = (_message) => {
    console.log(_getFormatTime() + " " , _message);
}

export const error = (_message) => {
  console.error(_getFormatTime() + " " , _message);
}

export const _getFormatTime = () => {
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
    let seconds = date_ob.getSeconds();

    return "[" + day + "-" + month + "-" + year + "_" + hours + ":" + minutes + "]";
}

// Checks if string can be converted to int if Nan is found then it'll return 
// a default value. Default = 0
export const _getInteger = (_stringVal, _default = 0) =>{
    let intValue = parseInt(_stringVal);
    return isNaN(intValue) ? _default : intValue;
}