const Joi = require('joi');
const {MESSAGE} = require('../../util/constant');
const challanApproveServices = require('../../services/challan_approval_services/approve_challan_services');

const schema = Joi.object({
    challan_id:Joi.number().required(),
    approver_id: Joi.number().required(),
    approver_stack: Joi.string().valid("RDC", "ApprovedBy", "CheckedBy").required(),
    next: Joi.string().valid("RDC", "ApprovedBy", "CheckedBy").required(),
    challan_type: Joi.string().valid("sewing", "wash").required()
});

const controller = async(req, res)=>{
    try{
        const data = await challanApproveServices(req.body);
        if(data.message!=="Success"){
            return res.status(MESSAGE.SUCCESS_GET.STATUS_CODE).json({message:data.message});
        }
        req.io.emit("notify_challan", data.data);
        return res.status(MESSAGE.SUCCESS_GET.STATUS_CODE).json({message:"Success"});
    }catch(error){
        console.log(error);
        return res.status(MESSAGE.SERVER_ERROR.STATUS_CODE).send(MESSAGE.SERVER_ERROR.CONTENT);
    }
}

module.exports = {controller, schema}