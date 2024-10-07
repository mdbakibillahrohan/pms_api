const Joi=require("joi");
const {
    MESSAGE
}=require("../../../../util/constant");
const create_update_cat_map_services=require("../../../../services/tender/user_cat_map/create_update/create_update_cat_map_services")

const schema=Joi.object({
    MaxLen:Joi.number().required(),
    UserCatLists:Joi.array().items({
        tender_cat_id:Joi.number().required(),
        tender_user_id:Joi.number().required(),
        tender_user_cat_map_id:Joi.string().required(),
        is_delete:Joi.number().required()
    })
})

const controller=async(req,res)=>{
    try{
        const data=await create_update_cat_map_services(req.body);

        if (data.message==="success") {
            return res.status(200).json({ message: "Successfully inserted", status_code: 201, data: data.data,IsEntry:true });
        }
        return res.status(200).json({ message: [],IsEntry:false});
    }catch(error){
        console.log(error);
        return res.status(MESSAGE.SERVER_ERROR.STATUS_CODE).send(MESSAGE.SERVER_ERROR.CONTENT);
    }
}

module.exports={controller,schema}