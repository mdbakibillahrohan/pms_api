const Joi = require('joi');
const { 
    MESSAGE,
    SOCKET 
} = require('../../../util/constant');
const addNewTimerServices = require('../../../services/tender/add_new_timer/add_new_timer_services');

const schema = Joi.object({
    TenderNo:Joi.string().required(),
    TenderBidId: Joi.number().required(),
    Minutes: Joi.number().required(),
    IsFromBidding: Joi.number().allow(null).allow('').optional(),
    CreatedBy:Joi.number().required()
});

const controller = async (req, res) => {
    try {
        //req.body.userInfo = req.userInfo;
        //console.log(req.body)
        const data = await addNewTimerServices(req);
        //console.log(data)
        if (data.message==="success") {
            const {
                TenderNo
            }=req.body;
            req.io.emit(SOCKET.NOTIFY_ADD_NEW_TIMER, TenderNo);
            return res.status(200).json({ message: "Successfully inserted", status_code: 201, data: data.data,IsEntry:true });
        }
        return res.status(200).json({ message: [],IsEntry:false});
    } catch (error) {
        console.log(error);
        return res.status(MESSAGE.SERVER_ERROR.STATUS_CODE).send(MESSAGE.SERVER_ERROR.CONTENT);
    }
}

module.exports = { controller, schema }