const Joi = require('joi');
const {MESSAGE, SOCKET} = require('../../util/constant');
const challanApproveServices = require('../../services/challan_approval_services/approve_challan_services');

const schema = Joi.object({
    challan_id:Joi.number().required(),
    approver_stack: Joi.string().valid("RDC", "ApprovedBy", "CheckedBy").required(),
    next: Joi.string().valid("RDC", "ApprovedBy", "CheckedBy").optional(),
    challan_type: Joi.string().valid("sewing", "wash").required()
});

const controller = async(req, res)=>{
    try{
        req.body.userInfo = req.userInfo;
        const data = await challanApproveServices(req.body);
        data.data.UserId = req.userInfo.UserId;
        if(data.message!=="Success"){
            return res.status(MESSAGE.SUCCESS_GET.STATUS_CODE).json({message:data.message});
        }
        req.io.emit(SOCKET.NOTIFY_CHALLAN, data.data);
        return res.status(MESSAGE.SUCCESS_GET.STATUS_CODE).json({message:data.message});
    }catch(error){
        console.log(error);
        return res.status(MESSAGE.SERVER_ERROR.STATUS_CODE).send(MESSAGE.SERVER_ERROR.CONTENT);
    }
}

module.exports = {controller, schema}