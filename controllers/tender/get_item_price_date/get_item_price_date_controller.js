const Joi = require('joi');
const { MESSAGE } = require('../../../util/constant');
const getGradeListsServices = require('../../../services/tender/get_item_price_date/get_item_price_date_services');


const schema = Joi.object({
    ItemName:Joi.string().required(),
    ItemId:Joi.number().required()
});

const controller = async(req, res) => {
    try {
        const data = await getGradeListsServices(req.body);
        if (data) {
            return res.status(MESSAGE.SUCCESS_GET.STATUS_CODE).json({ message: MESSAGE.SUCCESS_GET.CONTENT, status_code: MESSAGE.SUCCESS_GET.STATUS_CODE, data });
        }
        return res.status(MESSAGE.SERVER_ERROR.STATUS_CODE).json({ message: MESSAGE.SERVER_ERROR.CONTENT });
    } catch (error) {
        console.log(error);
        return res.status(MESSAGE.SERVER_ERROR.STATUS_CODE).send(MESSAGE.SERVER_ERROR.CONTENT);
    }
}

module.exports = { controller, schema }