const Joi = require('joi');
const { MESSAGE } = require('../../util/constant');
const challanCheckingListServices = require('../../services/challan_checking_services/challan_checking_list_services');

const schema = Joi.object({
    list_type: Joi.string().valid("waiting", "passed").required(),
    checking_type: Joi.string().valid("wash", "finishing").required()
});

const controller = async (req, res) => {
    try {
        req.body.userInfo = req.userInfo;
        const data = await challanCheckingListServices(req.body)
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