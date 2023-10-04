const { getData } = require("../../util/dao");
const { dbConfig } = require("../../util/settings");

const challanApproveAuthorizationServices = async(req)=>{
    const {userInfo} = req;
    const {approver_stack} = req.body;
    const isAuthorize = await isAuthorizedForThisRequest(userInfo, approver_stack);
    return isAuthorize;
}

const isAuthorizedForThisRequest = async(userInfo, approver_stack)=>{
    const query = `select cap.UserId, cpt.ChallanPermissionType from ChallanApprovalPermission cap
                    inner join ChallanPermissionType cpt on cpt.CPTId = cap.CPTId
                    where cap.UserId = ${userInfo.UserId}`;
    const data = await getData(dbConfig, query);
    if(data.length===0){
        return false;
    }
    return data[0].ChallanPermissionType.includes(approver_stack);
}

module.exports = challanApproveAuthorizationServices;