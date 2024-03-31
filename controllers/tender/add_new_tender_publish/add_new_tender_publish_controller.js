const Joi = require('joi');
const { MESSAGE,SOCKET } = require('../../../util/constant');
const addNewTenderPublishServices = require('../../../services/tender/add_new_tender_publish/add_new_tender_publish_services');

const schema = Joi.object({
    TenderBidId:Joi.number().required(),
    TenderId: Joi.number().required(),
    OpenDate:Joi.date().required(),
    Description:Joi.string().required(),
    CloseDate:Joi.date().required(),
    CreatedBy:Joi.number().required(),
});

const controller = async (req, res) => {
    try {
        //req.body.userInfo = req.userInfo;
        //console.log(req.body)
        const data = await addNewTenderPublishServices(req.body);
        //console.log(data)
        if(data.message==="success") {
            //const {TenderId}=req.body;
            req.io.emit(SOCKET.NOTIFY_NEW_TENDER_PUBLISH, data);
            return res.status(200).json({ message: "Successfully inserted", status_code: 201, data: data.data,IsEntry:true });
        }else if(data.message==="exists"){
            return res.status(200).json({ message: "Tender are exists.", status_code: 210, data: "",IsEntry:false });
        }
        return res.status(200).json({ message: [],IsEntry:false});
    } catch (error) {
        console.log(error);
        return res.status(MESSAGE.SERVER_ERROR.STATUS_CODE).send(MESSAGE.SERVER_ERROR.CONTENT);
    }
}

module.exports = { controller, schema }