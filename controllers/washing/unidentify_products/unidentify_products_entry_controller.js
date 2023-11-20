const Joi = require('joi');
const { MESSAGE } = require('../../../util/constant');
const unidentifyProductsEntryServices = require('../../../services/washing_services/unidentify_products/unidentify_products_entry_services');

const schema = Joi.object({
    StyleId: Joi.number().required(),
    ColorId: Joi.number().required(),
    Size: Joi.string().required(),
    Quantity: Joi.number().required(),
    FromUnitId: Joi.number().required(),
    ToUnitId: Joi.number().required(),
    CreatedBy: Joi.number().required()
});

const controller = async (req, res) => {
    try {
        //req.body.userInfo = req.userInfo;
        const data = await unidentifyProductsEntryServices(req.body);
        if (data.message==="success") {
            return res.status(201).json({ message: "Successfully inserted", status_code: 201, data: data.data });
        }
        return res.status(200).json({ message: data.message});
    } catch (error) {
        console.log(error);
        return res.status(MESSAGE.SERVER_ERROR.STATUS_CODE).send(MESSAGE.SERVER_ERROR.CONTENT);
    }
}

module.exports = { controller, schema }