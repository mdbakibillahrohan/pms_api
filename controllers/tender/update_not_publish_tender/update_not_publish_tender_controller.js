const Joi = require('joi');
const { MESSAGE,SOCKET } = require('../../../util/constant');
const addNewTenderServices = require('../../../services/tender/update_not_publish_tender/update_not_publish_tender_services');

const schema = Joi.object({
   // TenderId:Joi.number().required(),
    TenderNo: Joi.string().required(),
    TenderTitle: Joi.string().required(),
    TenderTotalAmount: Joi.number().required(),
    MinimumBidAmount:Joi.number().required(),
    TenderDetails: Joi.string().required(),
    TenderAttachment:Joi.string().required(),
    UpdatedBy:Joi.number().required(),
    PreviousItems:Joi.array().items({
        ItemId:Joi.number().required(),
    }),
    CurrentItems:Joi.array().items({
        TenderId:Joi.number().required(),
        ItemId:Joi.number().required(),
        ItemName:Joi.string().required(),
        ItemRemarks:Joi.string().required(),
        UnitOfMeasurement:Joi.string().required(),
        ItemGrade:Joi.number().allow(null).allow('').optional(),
        ItemPrice:Joi.number().allow(null).allow('').optional(),
        ItemTargetPrice:Joi.number().required(),
        ItemQuantity:Joi.number().required(),
        ItemTotalAmount:Joi.number().required(),
        CreatedBy:Joi.number().required(),
        LastBidDate:Joi.string().allow(null).allow('').optional()
    }),
});

const controller = async (req, res) => {
    try {
        //req.body.userInfo = req.userInfo;
        //console.log(req.body)
        const data = await addNewTenderServices(req.body);
        //console.log("Data: ",data)
        //console.log(data)
        if (data.message==="success") {
            const {TenderNo}=req.body;
            req.io.emit(SOCKET.NOTIFY_ADD_NEW_TENDER, TenderNo);
            return res.status(200).json({ message: "Successfully inserted", status_code: 201, data: data.data,IsEntry:true });
        }
        return res.status(200).json({ message: [],IsEntry:false});
    } catch (error) {
        console.log(error);
        return res.status(MESSAGE.SERVER_ERROR.STATUS_CODE).send(MESSAGE.SERVER_ERROR.CONTENT);
    }
}

module.exports = { controller, schema }