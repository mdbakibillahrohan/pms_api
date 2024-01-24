const Joi = require('joi');
const { MESSAGE } = require('../../util/constant');
const newRegistrationServices = require('../../services/authentication_services/tms_registration_services');

const schema = Joi.object({
    FirstName: Joi.string().required(),
    LastName: Joi.string().required(),
    Email: Joi.string().required(),
    Phone: Joi.string().required(),
    Password: Joi.string().required(),
    PresentAddress: Joi.string().optional().empty(),
    PermanentAddress: Joi.string().optional().empty()
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