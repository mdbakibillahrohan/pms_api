const Joi = require('joi');
const { MESSAGE } = require('../../util/constant');
const newRegistrationServices = require('../../services/authentication_services/tms_user_registration_services');

const schema = Joi.object({
    CompanyName: Joi.string().required(),
    CompanyEmail: Joi.string().required(),
    CompanyPhone: Joi.string().required(),
    CompanyAddress: Joi.string().required(),
    Password: Joi.string().required()
});

const controller = async (req, res) => {
    try {
        //req.body.userInfo = req.userInfo;
        const data = await newRegistrationServices(req.body);
        if (data.message==="success") {
            return res.status(200).json({ message: "Successfully inserted", status_code: 201, data: data.data,IsEntry:true });
        }
        return res.status(200).json({ message: data.message,IsEntry:data.IsEntry});
    } catch (error) {
        console.log(error);
        return res.status(MESSAGE.SERVER_ERROR.STATUS_CODE).send(MESSAGE.SERVER_ERROR.CONTENT);
    }
}

module.exports = { controller, schema }