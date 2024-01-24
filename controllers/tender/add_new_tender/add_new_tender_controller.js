const Joi = require('joi');
const { MESSAGE } = require('../../../util/constant');
const addNewTenderServices = require('../../../services/tender/add_new_tender/add_new_tender_services');

const schema = Joi.object({
    TenderNo: Joi.string().required(),
    TenderTitle: Joi.string().required(),
    TenderTotalAmount: Joi.number().required(),
    MinimumBidAmount:Joi.number().required(),
    TenderDetails: Joi.string().required(),
    CreatedBy:Joi.number().required(),
    Details:Joi.array().items({
        ItemName:Joi.string().required(),
        UnitOfMeasurement:Joi.string().required(),
        ItemPrice:Joi.number().required(),
        ItemQuantity:Joi.number().required(),
        ItemTotalAmount:Joi.number().required(),
        CreatedBy:Joi.number().required()
    })
});

const controller = async (req, res) => {
    try {
        //req.body.userInfo = req.userInfo;
        //console.log(req.body)
        const data = await addNewTenderServices(req.body);
        //console.log(data)
        if (data.message==="success") {
            return res.status(200).json({ message: "Successfully inserted", status_code: 201, data: data.data,IsEntry:true });
        }
        return res.status(200).json({ message: [],IsEntry:false});
    } catch (error) {
        console.log(error);
        return res.status(MESSAGE.SERVER_ERROR.STATUS_CODE).send(MESSAGE.SERVER_ERROR.CONTENT);
    }
}

module.exports = { controller, schema }