const Joi = require('joi');
const { MESSAGE } = require('../../util/constant');
const challanCheckingSummaryServices = require('../../services/challan_checking_services/challan_checking_summary_services');

const schema = Joi.object({
    challan_id: Joi.number().required(),
    checking_type: Joi.string().valid("WashChecking", "FinishingChecking").required(),
    is_return: Joi.boolean().optional()
});

const controller = async (req, res) => {
    try {
        req.body.userInfo = req.userInfo;
        const data = await challanCheckingSummaryServices(req.body);
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