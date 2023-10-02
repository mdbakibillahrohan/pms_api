const Joi = require('joi');
const _ = require('lodash');
const {MESSAGE, SOCKET} = require('../../util/constant');
const createChallanServices = require('../../services/challan_approval_services/create_challan_services');

const schema = Joi.object({
    user_id: Joi.number().required(),
    challan_id: Joi.number().required(),
    challan_type: Joi.valid("wash", "sewing").required(),
    unit_id: Joi.number().required(),
});

const controller = async(req, res)=>{
    try{
        const {user_id, challan_type, unit_id} = req.body;
        const challanData = await createChallanServices(req.body);
        if(challanData){
            const sendData = _.clone(challanData);
            sendData.UserId = user_id;
            sendData.For = "RDC";
            sendData.Next = "Approved By";
            sendData.ChallanType = challan_type;
            sendData.FromUnitId = unit_id;
            req.io.emit(SOCKET.NOTIFY_CHALLAN, sendData);
            return res.status(MESSAGE.SUCCESS_GET.STATUS_CODE).json({message:"Success"});
        }
        return res.status(MESSAGE.BAD_REQUEST.STATUS_CODE).json({message:MESSAGE.BAD_REQUEST.CONTENT, status_code: MESSAGE.BAD_REQUEST.STATUS_CODE});
    }catch(error){
        console.log(error);
        return res.status(MESSAGE.SERVER_ERROR.STATUS_CODE).send(MESSAGE.SERVER_ERROR.CONTENT);
    }
}

module.exports = {controller, schema}