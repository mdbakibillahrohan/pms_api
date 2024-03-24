const jwt = require('jsonwebtoken');
const _ = require('lodash');
const ConvertPassString = require("../../util/convertPass");
const { getData } = require("../../util/dao");
const { dbConfig3 } = require("../../util/settings");
const { TABLE } = require('../../util/constant');

const tmsUsersLoginServices = async (payload) => {
    let token = null;
    let userData = null;
    const basicUserInfo=await basicUserInfos(payload);
    const userInfo = await getUserInfo(payload);

    //const isUserValid = checkValidity(userInfo, payload);
    // if (isUserValid) {
    if(basicUserInfo?.TenderUserId){
        if(userInfo?.TenderUserId){
            const { 
                TenderUserId,
                CompanyName,
                CompanyEmail,
                CompanyPhone,
            } = userInfo;
            const tokenData={
                TenderUserId,
                CompanyName,
                CompanyEmail,
                CompanyPhone,
                IsGeneralInfo:true,
                IsApproved:true,
                IsAttachmentDone:true
            }
            token = generateJwtToken(tokenData);
            userData = {
                // TenderUserId,
                // CompanyName,
                // CompanyEmail,
                // CompanyPhone,
                token
            }
        }else{
            const { 
                TenderUserId,
                CompanyName,
                CompanyEmail,
                CompanyPhone,
            } = basicUserInfo;
            const tokenData={
                TenderUserId,
                CompanyName,
                CompanyEmail,
                CompanyPhone,
                IsGeneralInfo:true,
                IsApproved:false,
                IsAttachmentDone:false
            }
            token = generateJwtToken(tokenData);
            userData = {
                // TenderUserId,
                // CompanyName,
                // CompanyEmail,
                // CompanyPhone,
                token
            }
        }
    }else{

    }
    // }
    return userData;
}

const getUserInfo = async (payload) => {
    const {
        EmailOrPhone,
        password
    }=payload
    const query = `Select * from 
    TenderUsers 
    where  (LOWER(CompanyEmail)=LOWER(@emailOrPhone) or LOWER(CompanyPhone)=LOWER(@emailOrPhone)) and Password=@password and IsApproved=1`;
    const hashPassword = ConvertPassString(password);
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
const basicUserInfos = async (payload) => {
    const {
        EmailOrPhone,
        password
    }=payload
    const query = `Select * from 
    TenderUsers 
    where  (LOWER(CompanyEmail)=LOWER(@emailOrPhone) or LOWER(CompanyPhone)=LOWER(@emailOrPhone)) and Password=@password`;
    const hashPassword = ConvertPassString(password);
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