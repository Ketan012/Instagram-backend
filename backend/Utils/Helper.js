const moment = require('moment');
class Helper{
    
    toLowerCase(str){
        return str.toLowerCase();        
    }

    toUpperCase(str){
        return str.toUpperCase();        
    }

    toIsoFormat(date){
        return date.toISOString();
    }

    toDateFormat(date, format){
        return moment(date, "DD/MM/YYYY").format(String(format));
    }

    toIsoFormatWithoutTime(date){
        return date.toISOString().substring(0,10);
    }

    generateRandomNumber(){
        return Math.floor(100000 + Math.random() * 900000);
    }

}

module.exports = new Helper();
