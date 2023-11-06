const Joi = require('joi');
const { MESSAGE } = require('../../util/constant');
const cuttingToFinishingReportServices = require('../../services/reports_services/cutting_to_finishing_report_services');


const schema = Joi.object({
    fromDate: Joi.date().optional(),
    toDate: Joi.date().optional(),
    buyerId: Joi.number().optional(),
    styleId: Joi.number().optional(),
    isDate: Joi.number().optional()
});

const controller = async(req, res) => {
    try {
        //req.query.userInfo = req.userInfo;
        const data = await cuttingToFinishingReportServices(req.query);
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