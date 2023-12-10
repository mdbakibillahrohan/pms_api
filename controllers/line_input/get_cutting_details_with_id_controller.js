const Joi = require('joi');
const { MESSAGE } = require('../../util/constant');
const getCuttingDetailsWithIdServices = require('../../services/line_input/get_cutting_details_with_id_services');


const schema = Joi.object({
    id:Joi.number().required()
});

const controller = async(req, res) => {
    try {
        const data = await getCuttingDetailsWithIdServices(req.query);
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