const Joi = require('joi');
const { MESSAGE } = require('../../../util/constant');
const getPublishTenderDetailsWithIdServices = require('../../../services/tender/get_tender_publish_with_id/get_tender_publish_with_id_services');


const schema = Joi.object({
    TenderNo:Joi.string().required(),
});

const controller = async(req, res) => {
    try {
        const data = await getPublishTenderDetailsWithIdServices(req.query);
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