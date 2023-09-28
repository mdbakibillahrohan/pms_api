const Joi = require('joi');
const {MESSAGE} = require('../../util/constant');
const approve_services = require('../../services/challan_approval_services/approve_services');


const schema = Joi.object({
    name:Joi.string().min(1).max(128).required()
});

const controller = async(req, res)=>{
    try{
        const data = await approve_services(req.body);
        const send_data = {
            message:MESSAGE.SUCCESS_GET.CONTENT,
            data
        }
        return res.status(MESSAGE.SUCCESS_GET.STATUS_CODE).json(send_data);
    }catch(error){
        console.log(error);
        return res.status(MESSAGE.SERVER_ERROR.STATUS_CODE).send(MESSAGE.SERVER_ERROR.CONTENT);
    }
}

module.exports = {controller, schema}