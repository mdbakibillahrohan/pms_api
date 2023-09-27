const Joi = require("joi");
const {executeSqlB}=require('../../util/db');

const schema=Joi.object().keys({
    EmpId: Joi.string().trim().min(3).max(10).required(),
    StartDate:Joi.string().trim().required(),
    EndDate:Joi.string().trim().required()
})


const GetUserDailyMovementController=async(req,res)=>{
    const isValidater=schema.validate(req.query);
    
    if(isValidater){
        let {EmpId,StartDate,EndDate}=req.query;
        
        // Check Query data is valid or not
        if(EmpId && StartDate && EndDate){
            const DailyMovementSql=`exec sp_Report @desc1=${EmpId},@desc2='${StartDate}',@desc3='${EndDate}', @calltype='Get_Movement_Report';`;
            const DailyMovementData=await getData(res,DailyMovementSql);
    
            if(DailyMovementData.length){
                return res.status(200).json({IsSuccess:true,data:DailyMovementData});
            }else{
                return res.status(200).json({IsSuccess:true,data:[]})
            }
        }else{
            return res.status(500).json({IsSuccess:false,message:"Internal Server Error."})
        }
    }else{
        return res.status(500).json({IsSuccess:false,message:'Internal Server Error.'})
    }
}

const getData=async(res,queries)=>{
    try{
        const dataLists=await executeSqlB(queries);

        const data=dataLists.recordsets[0];

        return data;
    }catch{
        return res.status(500).json({IsSuccess:false,message:'Internal Server Error.'})
    }
}

module.exports=GetUserDailyMovementController;