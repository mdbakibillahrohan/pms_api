const Joi = require('joi');
const { MESSAGE } = require('../../util/constant');
const gateInOutDashboardService = require('../../services/gate_in_out_dashboard_services/gate_in_out_dashboard_services');

const schema = Joi.object({
    date: Joi.date().iso().optional(),
    gate_in_type: Joi.string().valid("in", "out").required(),
    challan_type: Joi.string().valid("wash", "sewing", "finishing").required()
});

const controller = async (req, res) => {
    try {
        req.body.userInfo = req.userInfo;
        const data = await gateInOutDashboardService(req.body);
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