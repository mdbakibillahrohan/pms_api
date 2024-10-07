const Joi=require("joi");
const {MESSAGE}=require('../../../../util/constant');
const get_category_with_id_services=require("../../../../services/tender/category/get_category_with_id/get_category_with_id_services");


const schema=Joi.object({
    CategoryId:Joi.number().required()
})

const controller=async(req,res)=>{
    try{
        const data=await get_category_with_id_services(req.query);
        if(data.message='success'){
            return res.status(MESSAGE.SUCCESS_GET.STATUS_CODE).json({ message: MESSAGE.SUCCESS_GET.CONTENT, status_code: MESSAGE.SUCCESS_GET.STATUS_CODE, data });
        }
        return res.status(MESSAGE.SERVER_ERROR.STATUS_CODE).json({ message: MESSAGE.SERVER_ERROR.CONTENT });
    }catch(error){
        console.log(error);
        return res.status(MESSAGE.SERVER_ERROR.STATUS_CODE).send(MESSAGE.SERVER_ERROR.CONTENT);
    }
}
module.exports={schema,controller};