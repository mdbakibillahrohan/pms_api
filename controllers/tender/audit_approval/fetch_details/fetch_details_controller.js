const {MESSAGE}=require('../../../../util/constant');
const Joi=require('joi');
const fetch_all_services=require('../../../../services/tender/audit_approval/fetch_details/fetch_details_services')


const schema=Joi.object({
    TenderNo:Joi.string().required()
});

const controller=async(req,res)=>{
    try{
        const data=await fetch_all_services(req.query);

        if(data){
            return res.status(MESSAGE.SUCCESS_GET.STATUS_CODE).json({message:MESSAGE.SUCCESS_GET.CONTENT,status_code:MESSAGE.SUCCESS_GET.STATUS_CODE,data:data})
        }
    }catch(error){
        console.log(error);
        return res.status(MESSAGE.SERVER_ERROR.STATUS_CODE).send(MESSAGE.SERVER_ERROR.CONTENT)
    }
}

module.exports={controller,schema};