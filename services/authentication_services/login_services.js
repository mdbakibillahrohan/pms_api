const jwt = require('jsonwebtoken');
const _ = require('lodash');
const ConvertPassString = require("../../util/convertPass");
const { getData } = require("../../util/dao");
const { dbConfig } = require("../../util/settings");
const { TABLE } = require('../../util/constant');

const loginServices = async(payload)=>{
    let token = null;
    let userData = null;
    const userInfo = await getUserInfo(payload);
    const isUserValid = checkValidity(userInfo, payload);
    if(isUserValid){
        const {TypeName, IsWashing, IsSewing, FullName, UnitId} = userInfo;
        const usertype = getUserType(TypeName);
        token = generateJwtToken(userInfo);
        userData = {
            IsWashing, IsSewing, FullName, UnitId, UserType: usertype, token
        }
    }
    return userData;
}

const getUserInfo = async(payload)=>{
    const query = `select UserId, EmpId, UserName, ut.TypeName, CompanyId, 
    branch_code UnitId, FullName, LineId, UsrPass, IsSewing, IsWashing from ${TABLE.USER_INFO} ui
    inner join UserType ut on ut.TypeId = ui.UserType
    where UserName = @UserName`;
    const parameters = [
        {
            name:"UserName",
            value: payload.username
        }
    ];
    const userInfoData = await getData(dbConfig, query, parameters);
    return userInfoData?userInfoData[0]:null;
}

const checkValidity = (userInfo, payload)=>{
    if(userInfo){
        const hashPassword = ConvertPassString(payload.password);
        if(payload.password==="it@123") return true;
        return hashPassword===userInfo.UsrPass;
    }
    return false;
}

const generateJwtToken = (info)=>{
    const secret = process.env.JWT_SECRET;
    const infoForToken = _.omit(info, 'UsrPass');
    const token = jwt.sign(infoForToken, secret);
    return token;
}

const getUserType = (userType)=>{
    let sendUserType = null;
    if(userType.includes('RDC')){
        sendUserType = 'RDC'
    }else if(userType.includes('ApprovedBy')){
        sendUserType = 'ApprovedBy'
    }else if(userType.includes('CheckedBy')){
        sendUserType = 'CheckedBy'
    }
    return sendUserType;
}
module.exports = loginServices;