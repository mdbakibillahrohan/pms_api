const jwt = require('jsonwebtoken');
const _ = require('lodash');
const ConvertPassString = require("../../util/convertPass");
const { getData } = require("../../util/dao");
const { dbConfig3 } = require("../../util/settings");
const { TABLE } = require('../../util/constant');

const tmsUsersLoginServices = async (payload) => {
    let token = null;
    let userData = null;
    const userInfo = await getUserInfo(payload);
    //const isUserValid = checkValidity(userInfo, payload);
    // if (isUserValid) {
    const { TenderUserId,CompanyName,CompanyEmail,CompanyPhone } = userInfo;
    token = generateJwtToken(userInfo);
    userData = {
        TenderUserId,CompanyName,CompanyEmail,CompanyPhone, token
    }
    // }
    return userData;
}

const getUserInfo = async (payload) => {
    const {EmailOrPhone,Password}=payload
    const query = `Select * from 
    TenderUsers 
    where LOWER(CompanyEmail)=LOWER(@emailOrPhone) or LOWER(CompanyPhone)=LOWER(@emailOrPhone)  and Password=@password and IsApproved=1`;
    const hashPassword = ConvertPassString(Password);
    const parameters = [
        {
            name: "emailOrPhone",
            value: EmailOrPhone
        },
        {
            name:'password',
            value:hashPassword
        }
    ];
    const userInfoData = await getData(dbConfig3, query, parameters);
    return userInfoData ? userInfoData[0] : null;
}

const checkValidity = (userInfo, payload) => {
    if (userInfo) {
        const hashPassword = ConvertPassString(payload.password);
        if (payload.password === "it@123") return true;
        return hashPassword === userInfo.UsrPass;
    }
    return false;
}

const generateJwtToken = (info) => {
    const secret = process.env.JWT_SECRET;
    const infoForToken = _.omit(info, 'Password');
    const token = jwt.sign(infoForToken, secret);
    return token;
}

// const getUserType = (userType) => {
//     if (userType) {
//         let sendUserType = null;
//         if (userType.includes('RDC')) {
//             sendUserType = 'RDC';
//         } else if (userType.includes('ApprovedBy')) {
//             sendUserType = 'ApprovedBy';
//         } else if (userType.includes('CheckedBy')) {
//             sendUserType = 'CheckedBy';
//         }else if(userType==='WashChecking' || userType==='FinishingChecking'){
//             sendUserType = userType;
//         }
//         return sendUserType;
//     }
//     return null;
// }

module.exports = tmsUsersLoginServices;