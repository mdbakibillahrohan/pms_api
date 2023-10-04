const challanApproveAuthorizationServices = require("../services/authorization_services/challan_approval_authorization_services");
const { MESSAGE } = require("../util/constant");

const approvalAuthorizationMiddleware = async(req, res, next)=>{
    const challanApproveAuthorization = await challanApproveAuthorizationServices(req);
    if(!challanApproveAuthorization){
        return res.status(MESSAGE.UNAUTHORIZED.STATUS_CODE).json({message: MESSAGE.UNAUTHORIZED.CONTENT, status_code:MESSAGE.UNAUTHORIZED.STATUS_CODE});
    }
    next();
}

module.exports = approvalAuthorizationMiddleware;