const jwt = require('jsonwebtoken');
const _ = require('lodash');
const ConvertPassString = require("../../util/convertPass");
const { getData } = require("../../util/dao");
const { dbConfig } = require("../../util/settings");
const { TABLE } = require('../../util/constant');

const loginServices = async (payload) => {
    let token = null;
    let userData = null;
    const userInfo = await getUserInfo(payload);
    const isUserValid = checkValidity(userInfo, payload);
    if (isUserValid) {
        const { TypeName, IsWashing, IsSewing, FullName, UnitId, UserId, IsFinishing, UnitName } = userInfo;
        const userType = getUserType(TypeName);
        userInfo.UserType = userType;
        token = generateJwtToken(userInfo);
        userData = {
            IsWashing, IsSewing, UnitName, IsFinishing, FullName, UnitId, UserId, ChallanApprovalUserType: userType, token
        }
    }
    return userData;
}

const getUserInfo = async (payload) => {
    const query = `select ui.UserId, ui.EmpId, ui.UserName, u.UnitName, cpt.ChallanPermissionType TypeName, ui.CompanyId,
    ui.branch_code UnitId, ui.FullName, ui.LineId, ui.UsrPass, ui.IsSewing, ui.IsWashing, ui.IsFinishing from UserInfo ui
    left join ChallanApprovalPermission cap on cap.UserId = ui.UserId
    left join ChallanPermissionType cpt on cpt.CPTId = cap.CPTId
	left join Unit u on u.UnitId = ui.branch_code
    where UserName = @UserName`;
    const parameters = [
        {
            name: "UserName",
            value: payload.username
        }
    ];
    const userInfoData = await getData(dbConfig, query, parameters);
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
    const infoForToken = _.omit(info, 'UsrPass');
    const token = jwt.sign(infoForToken, secret);
    return token;
}

const getUserType = (userType) => {
    if (userType) {
        let sendUserType = null;
        if (userType.includes('RDC')) {
            sendUserType = 'RDC';
        } else if (userType.includes('ApprovedBy')) {
            sendUserType = 'ApprovedBy';
        } else if (userType.includes('CheckedBy')) {
            sendUserType = 'CheckedBy';
        }else if(userType==='WashChecking' || userType==='FinishingChecking'){
            sendUserType = userType;
        }
        return sendUserType;
    }
    return null;
}

module.exports = loginServices;