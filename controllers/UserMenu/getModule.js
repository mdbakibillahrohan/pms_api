const Joi = require("joi");
const {executeSqlB2}=require('../../util/db');
const chilMenuConfig=require('../../util/childMenuConfig')

const schema=Joi.object().keys({
    UserId: Joi.string().trim().min(3).max(10).required(),
})

const GetModuleController=async(req,res)=>{
    const isValidater=schema.validate(req.query);

    //console.log(req.query)
    if(isValidater){
        let responseLists=[];
        try{
            let {UserId}=req.query;

            let moduleSql=`exec sp_select_module @desc1=${UserId},@desc2=1,@calltype='get_all_module_by_user_permission';`

            const moduleData=await executeSqlB2(moduleSql);
            const moduleLists=moduleData.recordsets[0];

            if(moduleLists.length){
                responseLists=moduleLists.reduce((preModule,mData)=>{
                    return[
                        ...preModule,
                        {
                            ModuleID: mData.ModuleID,
                            MenuName: mData.ModuleName,
                            IconName: mData.IconName,
                            IconColor: mData.IconColor,
                            SortOrder: mData.SortOrder,
                        }
                    ]
                },[])
            }   
            return res.status(200).json({
                IsSuccess:true,
                ModuleLists:await responseLists
            })
        }catch{
            return res.status(500).json({message:'Internal Server Error!'})
        }
    }else{
        return res.status(500).json({message:'Internal Server Error!'})
    }
}

module.exports.GetModuleController=GetModuleController;