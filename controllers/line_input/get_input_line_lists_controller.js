const Joi = require('joi');
const { MESSAGE } = require('../../util/constant');
const getInputLineListsServices = require('../../services/line_input/get_input_line_lists_services');


const schema = Joi.object({
    userId:Joi.number().required(),
    filterDate:Joi.string().required()
});

const controller = async(req, res) => {
    try {
        const data = await getInputLineListsServices(req.query);
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