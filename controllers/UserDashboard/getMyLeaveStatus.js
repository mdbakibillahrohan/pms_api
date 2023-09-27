const Joi = require("joi");
const {executeSqlB}=require('../../util/db');

const schema=Joi.object().keys({
    EmpId: Joi.string().trim().min(3).max(10).required(),
    GetYear: Joi.string().trim().min(3).max(10).required(),
})

const GetMyLeaveStatusController=async(req,res)=>{
    const isValidater=schema.validate(req.query);

    //console.log(req.query)
    if(isValidater){
        try{
            let {EmpId,GetYear}=req.query;
            if(EmpId){
                let leaveSql=`exec sp_Select_Dashboard_Grid @skip=0,@take=0,@filter='',@param1=${EmpId},@param2=${GetYear},@calltype='get_leave_allocation_summary';`;
                const LeaveStatus=await executeSqlB(leaveSql);
               
                const LeaveStatusData=LeaveStatus.recordsets[1];

                return res.status(200).json({
                    IsSuccess:true,
                    data:LeaveStatusData
                })
            } 
            res.status(500).json({message:"Internal Server Error!"});
        }catch{
            return res.status(500).json({message:'Internal Server Error!'})
        }
    }else{
        return res.status(500).json({message:'Internal Server Error!'})
    }
}

module.exports.GetMyLeaveStatusController=GetMyLeaveStatusController;