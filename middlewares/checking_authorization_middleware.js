const checkingAuthorizationServices = require("../services/authorization_services/checking_authorization_services");
const { MESSAGE } = require("../util/constant");

const checkingAuthorizationMiddleware = async(req, res, next)=>{
    const checkingAuthorization = await checkingAuthorizationServices(req);
    if(!checkingAuthorization){
        return res.status(MESSAGE.UNAUTHORIZED.STATUS_CODE).json({message: MESSAGE.UNAUTHORIZED.CONTENT, status_code:MESSAGE.UNAUTHORIZED.STATUS_CODE});
    }
    next();
}

module.exports = checkingAuthorizationMiddleware;