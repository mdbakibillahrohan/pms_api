const Joi = require('joi');
const { MESSAGE } = require('../../util/constant');
const totalProductionServices = require('../../services/finishing_dashboard_services/total_production_services');
const styleWiseTargetListServices = require('../../services/finishing_services/style_wise_target_list_services');


const schema = Joi.object({
    searchText: Joi.string().min(1).max(128).optional(),
    offset: Joi.number().optional(),
    limit: Joi.number().optional()
});

const controller = async(req, res) => {
    try {
        //req.query.userInfo = req.userInfo;
        const data = await styleWiseTargetListServices(req.query);
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