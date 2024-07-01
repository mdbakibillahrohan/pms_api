const Joi = require('joi');
const { MESSAGE } = require('../../../util/constant');
const getGradeListsServices = require('../../../services/tender/get_approver_lists_by_type/get_approver_lists_by_type_services');


const schema = Joi.object({
    TypeId:Joi.number().required()
});

const controller = async(req, res) => {
    try {
        const data = await getGradeListsServices(req.query);
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