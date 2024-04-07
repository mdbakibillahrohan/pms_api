const Joi = require('joi');
const { MESSAGE } = require('../../../util/constant');
const getTenderListsServices = require('../../../services/tender_public/get_bidding_details_with_id/get_bidding_details_with_id_services');


const schema = Joi.object({
   TenderNo:Joi.string().required(),
   UserId:Joi.number().required(),
   ItemLen:Joi.number().required()
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