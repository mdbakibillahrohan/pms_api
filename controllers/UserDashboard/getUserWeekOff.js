const Joi = require("joi");
const {executeSqlB}=require('../../util/db');

const schema=Joi.object().keys({
    EmpId: Joi.string().trim().min(3).max(10).required()
})


const UserWeekOffController=async(req,res)=>{
    const isValidater=schema.validate(req.query);
    
    if(isValidater){
        let {EmpId}=req.query;
        const weekOffData=await getWeekOffData(EmpId,res);

        return res.status(200).json({IsSuccess:true,data:weekOffData});
    }else{
        return res.status(500).json({IsSuccess:false,message:'Internal Server Error.'})
    }
}

const getWeekOffData=async(EmpId,res)=>{
    try{
        const sqlQueries=`exec sp_Select_Attendance @desc1=${EmpId},@calltype='GetWeekOffDatesByEmpid'`;

        const dataSheets=await executeSqlB(sqlQueries);
               
        const data=dataSheets.recordsets[0];

        return data;
    }catch{
        return res.status(500).json({IsSuccess:false,message:'Internal Server Error.'})
    }
}

module.exports=UserWeekOffController;