const Joi = require('joi');
const { MESSAGE } = require('../../../util/constant');
const getTenderListsServices = require('../../../services/tender/get_tender_details_with_TenderNo/get_tender_details_with_TenderNo_services');


const schema = Joi.object({
    TenderNo:Joi.string().required(),
});

const controller = async(req, res) => {
    try {
        const data = await getTenderListsServices(req.query);
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