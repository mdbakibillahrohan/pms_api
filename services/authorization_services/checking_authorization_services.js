const {getData} = require('../../util/dao');
const {dbConfig} = require('../../util/settings');
const checkingAuthorizationServices = async(req)=>{
    const userInfo = req.userInfo;
    const isAuthorize = await isAuthorizeForThisRequest(userInfo);
    return isAuthorize;
}

const isAuthorizeForThisRequest = async(userInfo)=>{
    const query = `select cap.UserId, cpt.ChallanPermissionType from ChallanApprovalPermission cap
                    inner join ChallanPermissionType cpt on cpt.CPTId = cap.CPTId
                    where cap.UserId = ${userInfo.UserId}`;
    const data = await getData(dbConfig, query);
    if(data.length===0){
        return false;
    }
    return data[0].ChallanPermissionType.includes(userInfo.UserType);
}

module.exports = checkingAuthorizationServices;