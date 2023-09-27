const CryptoJS = require("crypto-js");

const ConvertPassString=(passwordd)=>{
    //console.log(passwordd)
    let password = passwordd;
    let key = "ACC@WEB";
    let useHashing = true;

    if (useHashing){
        key = CryptoJS.MD5(key).toString();
    }

    let options = {
        mode: CryptoJS.mode.ECB, 
        padding: CryptoJS.pad.Pkcs7
    };

    let textWordArray = CryptoJS.enc.Utf8.parse(password);
    let keyHex = CryptoJS.enc.Hex.parse(key);

    // //console.log('hexadecimal key: ' + keyHex);

    let encrypted = CryptoJS.TripleDES.encrypt(textWordArray, keyHex, options);

    let base64String = encrypted.toString();

    //console.log(base64String)
    return base64String;
}
module.exports.ConvertPassString=ConvertPassString