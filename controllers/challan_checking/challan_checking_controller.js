
const Joi = require('joi');
const {MESSAGE, SOCKET} = require('../../util/constant');
const challanCheckingServices = require('../../services/challan_checking_services/challan_checking_services');

const schema = Joi.object({
    challan_id:Joi.number().required(),
    checking_type: Joi.string().valid("WashChecking", "FinishingChecking").required(),
    is_return: Joi.boolean().optional()
});

const controller = async(req, res)=>{
    try{
        req.body.userInfo = req.userInfo;
        const data = await challanCheckingServices(req.body);
        if(data.message!=="Success"){
            return res.status(MESSAGE.BAD_REQUEST.STATUS_CODE).json({message:data.message, status_code: MESSAGE.BAD_REQUEST.STATUS_CODE});
        }
        req.io.emit(SOCKET.NOTIFY_RETURN_CHALLAN_GATE_PASSED, data.data);
        return res.status(MESSAGE.SUCCESS_GET.STATUS_CODE).json({message:data.message, data:data.data, status_code: MESSAGE.SUCCESS_GET.STATUS_CODE});
    }catch(error){
        console.log(error);
        return res.status(MESSAGE.SERVER_ERROR.STATUS_CODE).send(MESSAGE.SERVER_ERROR.CONTENT);
    }
}

module.exports = {controller, schema}