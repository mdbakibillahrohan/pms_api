const Joi = require('joi');
const { MESSAGE,SOCKET } = require('../../../util/constant');
const addNewTenderServices = require('../../../services/tender_public/create_new_bidding/create_new_bidding_services');

const schema = Joi.object({
    TenderNo:Joi.string().required(),
    TenderId: Joi.number().required(),
    TenderBidId: Joi.number().required(),
    TenderUserId: Joi.number().required(),
    TotalAmount:Joi.number().required(),
    Details:Joi.array().items({
        TenderUserId:Joi.number().required(),
        ItemId:Joi.number().required(),
        BidPrice:Joi.number().required()
    })
});

const controller = async (req, res) => {
    try {
        //req.body.userInfo = req.userInfo;
        //console.log(req.body)
        const data = await addNewTenderServices(req.body);
        //console.log(data)
        if (data.message==="success") {
            const {
                TenderNo,
                TenderUserId
            }=req.body;
            req.io.emit(SOCKET.NOTIFY_TENDER_BID, {data:{
                TenderNo:TenderNo,
                TenderUserId:TenderUserId
            }});
            return res.status(200).json({ message: "Successfully inserted", status_code: 201, data: data.data,IsEntry:true });
        }
        return res.status(200).json({ message: [],IsEntry:false});
    } catch (error) {
        console.log(error);
        return res.status(MESSAGE.SERVER_ERROR.STATUS_CODE).send(MESSAGE.SERVER_ERROR.CONTENT);
    }
}

module.exports = { controller, schema }