const Joi=require('joi');
const {
    MESSAGE
}=require('../../../../util/constant');
const fetch_user_cat_map_services=require('../../../../services/tender/user_cat_map/fetch/fetch_user_cat_map_services')


const schema=Joi.object({
    TenderUserId:Joi.number().required()
})

const controller=async(req,res)=>{
    try{
        const data=await fetch_user_cat_map_services(req.query);
        if(data?.lists.length){
            return res.status(MESSAGE.SUCCESS_GET.STATUS_CODE).json({ message: MESSAGE.SUCCESS_GET.CONTENT, status_code: MESSAGE.SUCCESS_GET.STATUS_CODE, data });
        }
        return res.status(MESSAGE.SERVER_ERROR.STATUS_CODE).json({ message: MESSAGE.SERVER_ERROR.CONTENT });
    }catch(error){
        console.log(error);
        return res.status(MESSAGE.SERVER_ERROR.STATUS_CODE).send(MESSAGE.SERVER_ERROR.CONTENT);
    }
}

module.exports={controller,schema};