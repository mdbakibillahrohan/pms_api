const Joi = require('joi');
const _ = require('lodash');
const { MESSAGE } = require('../../../util/constant');
const returnFinishingChallanListService = require('../../../services/return_challan_services/return_finishing_challan_services/return_finishing_challan_list_services');

const schema = Joi.object({
    
});

const controller = async (req, res) => {
    try {
        const data = await returnFinishingChallanListService(req.body);
        if(data){
            return res.status(MESSAGE.SUCCESS_GET.STATUS_CODE).json({message:MESSAGE.SUCCESS_GET.CONTENT, status_code: MESSAGE.SUCCESS_GET.STATUS_CODE, data: data});
        }
        return res.status(MESSAGE.SERVER_ERROR.STATUS_CODE).json({ message: MESSAGE.SERVER_ERROR.CONTENT });
    } catch (error) {
        console.log(error);
        return res.status(MESSAGE.SERVER_ERROR.STATUS_CODE).json({ message: MESSAGE.SERVER_ERROR.CONTENT });
    }
}

module.exports = { controller, schema }