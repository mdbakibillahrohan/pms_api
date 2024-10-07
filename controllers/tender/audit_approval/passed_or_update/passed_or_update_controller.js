const Joi=require('joi');
const {MESSAGE}=require('../../../../util/constant');
const passed_or_update_services=require('../../../../services/tender/audit_approval/passed_or_update/passed_or_update_services');


const schema=Joi.object({
    TenderNo:Joi.string().required(),
    ChekedStatus:Joi.number().required(),
    UserId:Joi.number().required(),
    Items:Joi.array().items({
        ItemId:Joi.number().required(),
        ItemName:Joi.string().optional(),
        ItemQuantity:Joi.number().optional(),
        AuditQuantity:Joi.number().required(),
        AuditRemarks:Joi.string().optional()
    })
});

const controller=async(req,res)=>{
    try{
        const data=await passed_or_update_services(req.body);

        if(data){
            return res.status(200).json({ message: "Successfully Updated", status_code: 201, data: data.data,IsEntry:true });
        }
    }catch(error){
        console.log(error);
        return res.ststus(MESSAGE.SERVER_ERROR.STATUS_CODE).send(MESSAGE.SERVER_ERROR.CONTENT);
    }
}

module.exports={controller,schema};