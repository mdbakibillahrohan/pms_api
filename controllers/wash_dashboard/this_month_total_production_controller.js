const Joi = require('joi');
const { MESSAGE } = require('../../util/constant');
const thisMonthTotalProductionServices = require('../../services/wash_dashboard_services/this_month_total_production_services');

const schema = Joi.object({
    unitId: Joi.date().required()
});

const controller = async (req, res) => {
    try {
        //req.query.userInfo = req.userInfo;
        const data = await thisMonthTotalProductionServices(req.query);
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