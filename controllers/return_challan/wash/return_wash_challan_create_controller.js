const Joi = require('joi');
const _ = require('lodash');
const { MESSAGE,SOCKET } = require('../../../util/constant');
const returnWashChallanCreateServices = require('../../../services/return_challan_services/return_wash_challan_services/return_wash_challan_create_services');

const schema = Joi.object({
    user_id: Joi.number().required(),
    challan_id: Joi.number().required(),
    unit_id: Joi.number().required(),
});

const controller = async (req, res) => {
    try {
        const {user_id, unit_id} = req.body;
        const data = await returnWashChallanCreateServices(req.body);
        if(data){
            const sendData = _.clone(data[0]);
            sendData.UserId = user_id;
            sendData.FromUnitId = unit_id;
            req.io.emit(SOCKET.NOTIFY_RETURN_CHALLAN, sendData);
            return res.status(MESSAGE.SUCCESS_GET.STATUS_CODE).json({message:"Success", data: sendData});
        }
        return res.status(MESSAGE.SERVER_ERROR.STATUS_CODE).json({ message: MESSAGE.SERVER_ERROR.CONTENT });
    } catch (error) {
        console.log(error);
        return res.status(MESSAGE.SERVER_ERROR.STATUS_CODE).json({ message: MESSAGE.SERVER_ERROR.CONTENT });
    }
}

module.exports = { controller, schema }