const Joi = require('joi');
const { MESSAGE } = require('../../util/constant');
const addNewLineEntryServices = require('../../services/line_input/add_new_line_input_services');

const schema = Joi.object({
    InputDate: Joi.string().required(),
    CuttingDetailsId: Joi.number().required(),
    CuttingId: Joi.number().required(),
    UnitId: Joi.number().required(),
    LineId: Joi.number().required(),
    HourNo: Joi.number().required(),
    BundleNo: Joi.number().required(),
    BundleQty: Joi.number().required(),
    StyleId: Joi.number().required(),
    CreateBy: Joi.number().required()
});

const controller = async (req, res) => {
    try {
        //req.body.userInfo = req.userInfo;
        const data = await addNewLineEntryServices(req.body);
        if (data.message==="success") {
            return res.status(200).json({ message: "Successfully inserted", status_code: 201, data: data.data,IsEntry:false });
        }
        return res.status(200).json({ message: data.message,IsEntry:data.IsEntry});
    } catch (error) {
        console.log(error);
        return res.status(MESSAGE.SERVER_ERROR.STATUS_CODE).send(MESSAGE.SERVER_ERROR.CONTENT);
    }
}

module.exports = { controller, schema }