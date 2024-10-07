const Joi=require('joi');
const { MESSAGE } = require('../../../../util/constant');
const delete_category_services=require('../../../../services/tender/category/delete/delete_category_services');

const schema=Joi.object({
    CategoryId:Joi.number().required()
})

const controller=async(req,res)=>{
    try{
        const data=await delete_category_services(req.body);

        if(data?.message){
            return res.status(200).json({message:"Successfully Deleted.",status_code:201,data:data,is_delete:true});
        }
        return res.status(200).json({ message: [],IsEntry:false});
    }catch(error){
        console.log(error);
        return res.status(MESSAGE.SERVER_ERROR.STATUS_CODE).send(MESSAGE.SERVER_ERROR.CONTENT);
    }
}

module.exports={controller,schema};