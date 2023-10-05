const Joi = require('joi');
const {MESSAGE, SOCKET} = require('../../util/constant');
const rejectChallanServices = require('../../services/challan_approval_services/reject_challan_services');

const schema = Joi.object({
    challan_id:Joi.number().required(),
    approver_stack: Joi.string().valid("RDC", "ApprovedBy", "CheckedBy").required(),
    challan_type: Joi.string().valid("sewing", "wash").required()
});

const controller = async(req, res)=>{
    try{
        req.body.userInfo = req.userInfo;
        const data = await rejectChallanServices(req.body);
        if(data){
            return res.status(MESSAGE.SUCCESS_GET.STATUS_CODE).json({message:"Successfully reject challan"});
        }
        return res.status(400).json({message:"Something went wrong", status_code: 400});
    }catch(error){
        console.log(error);
        return res.status(MESSAGE.SERVER_ERROR.STATUS_CODE).send(MESSAGE.SERVER_ERROR.CONTENT);
    }
}

module.exports = {controller, schema}