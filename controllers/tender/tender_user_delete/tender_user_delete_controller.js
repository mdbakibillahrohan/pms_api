const Joi = require('joi');
const { MESSAGE,SOCKET } = require('../../../util/constant');
const addNewTenderServices = require('../../../services/tender/tender_user_delete/tender_user_delete_services');

const schema = Joi.object({
    TenderUserId:Joi.number().required(),
    DeletedBy:Joi.number().required()
});

const controller = async (req, res) => {
    try {
        //req.body.userInfo = req.userInfo;
        //console.log(req.body)
        const data = await addNewTenderServices(req.body);
        //console.log("Data: ",data)
        //console.log(data)
        if (data.message==="success") {
            //const {TenderNo}=req.body;
            //req.io.emit(SOCKET.NOTIFY_ADD_NEW_TENDER, TenderNo);
            return res.status(200).json({ message: "Successfully Updated", status_code: 201, data: data.data,IsEntry:true });
        }
        return res.status(200).json({ message: [],IsEntry:false});
    } catch (error) {
        console.log(error);
        return res.status(MESSAGE.SERVER_ERROR.STATUS_CODE).send(MESSAGE.SERVER_ERROR.CONTENT);
    }
}

module.exports = { controller, schema }