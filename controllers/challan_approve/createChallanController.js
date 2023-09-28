const Joi = require('joi');
const _ = require('lodash');
const {MESSAGE} = require('../../util/constant');
const createChallanServices = require('../../services/challan_approval_services/create_challan_services');


const schema = Joi.object({
    user_id: Joi.number().required(),
    challan_id: Joi.number().required(),
    challan_type: Joi.valid("wash", "sewing").required()
});

const controller = async(req, res)=>{
    try{
        const challanData = await createChallanServices(req.body);
        const sendData = _.clone(challanData, {user_id})
        req.io.emit("challan_created", sendData);
        return res.status(MESSAGE.SUCCESS_GET.STATUS_CODE).json({message:"Success"});
    }catch(error){
        console.log(error);
        return res.status(MESSAGE.SERVER_ERROR.STATUS_CODE).send(MESSAGE.SERVER_ERROR.CONTENT);
    }
}

module.exports = {controller, schema}