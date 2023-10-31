const Joi = require('joi');
const { MESSAGE } = require('../../util/constant');
const styleWiseTargerEntryServices = require('../../services/finishing_services/style_wise_target_entry_services');

const schema = Joi.object({
    styleId: Joi.number().required(),
    smv: Joi.number().required(),
    plantManpower: Joi.number().required(),
    hourlyTarget: Joi.number().required(),
    unitId: Joi.number().required()
});

const controller = async (req, res) => {
    try {
        //req.body.userInfo = req.userInfo;
        const data = await styleWiseTargerEntryServices(req.body);
        if (data.message==="success") {
            return res.status(201).json({ message: "Successfully inserted", status_code: 201, data: data.data });
        }
        return res.status(MESSAGE.BAD_REQUEST.STATUS_CODE).json({ message: data.message});
    } catch (error) {
        console.log(error);
        return res.status(MESSAGE.SERVER_ERROR.STATUS_CODE).send(MESSAGE.SERVER_ERROR.CONTENT);
    }
}

module.exports = { controller, schema }