const Joi = require('joi');
const { MESSAGE } = require('../../util/constant');
const getUserPermissionListServices = require('../../services/user_permission_services/get_user_permission_list_services');

const schema = Joi.object({
    offset: Joi.number().optional(),
    limit: Joi.number().optional(),
    search_text: Joi.string().min(1).max(128).optional()
});

const controller = async (req, res) => {
    try {
        req.body.userInfo = req.userInfo;
        const data = await getUserPermissionListServices(req.body);
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