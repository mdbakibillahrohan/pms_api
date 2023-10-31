const Joi = require('joi');
const { MESSAGE } = require('../../util/constant');
const styleWiseTargerEntryServices = require('../../services/finishing_services/style_wise_target_entry_services');

const schema = Joi.object({
    style_id: Joi.number().required(),
    smv: Joi.number().required(),
    plant_manpower: Joi.number().required(),
    hourly_target: Joi.number().required()
});

const controller = async (req, res) => {
    try {
        req.body.userInfo = req.userInfo;
        const data = await styleWiseTargerEntryServices(req.body);
        if (data.message==="success") {
            return res.status(MESSAGE.SUCCESS_GET.STATUS_CODE).json({ message: MESSAGE.SUCCESS_GET.CONTENT, status_code: MESSAGE.SUCCESS_GET.STATUS_CODE, data: data.data });
        }
        return res.status(MESSAGE.BAD_REQUEST.STATUS_CODE).json({ message: data.message});
    } catch (error) {
        console.log(error);
        return res.status(MESSAGE.SERVER_ERROR.STATUS_CODE).send(MESSAGE.SERVER_ERROR.CONTENT);
    }
}

module.exports = { controller, schema }