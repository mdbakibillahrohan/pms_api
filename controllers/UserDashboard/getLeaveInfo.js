const Joi = require("joi");
const {executeSqlB}=require('../../util/db');

const schema=Joi.object().keys({
    EmpId: Joi.string().trim().min(3).max(10).required(),
    GetYear: Joi.string().trim().min(3).max(10).required(),
})

const GetLeaveInfoController=async(req,res)=>{
    const isValidater=schema.validate(req.query);

    //console.log(req.query)
    if(isValidater){
        try{
            let {EmpId,GetYear}=req.query;
            if(EmpId){
                let leaveSql=`select a.LrId, a.EmpId, a.LeaveId,a.StartDate,a.EndDate,NoOfDays=CONVERT(DECIMAL(6, 1), a.NoOfDays),
                a.HalfDayPeriod,a.Reason,b.LeaveName
                from [Attendance_LeaveRegister] a 
                inner join [Common_LeaveType] b on a.LeaveId=b.LeaveId
                WHERE isnull(IsDeleted,0)=0 and a.EmpId=${EmpId} and Status=2 AND (YEAR(a.StartDate) =${GetYear} OR YEAR(a.EndDate) = ${GetYear})`;
                const LeaveInfo=await executeSqlB(leaveSql);
               
                const LeaveInfoData=LeaveInfo.recordsets[0];

                return res.status(200).json({
                    IsSuccess:true,
                    data:LeaveInfoData
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

module.exports.GetLeaveInfoController=GetLeaveInfoController;