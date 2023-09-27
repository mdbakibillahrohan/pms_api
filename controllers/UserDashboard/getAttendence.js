const Joi = require("joi");
const {executeSqlB}=require('../../util/db');

const schema=Joi.object().keys({
    EmpId: Joi.string().trim().min(3).max(10).required(),
    TableName: Joi.string().trim().min(3).max(20).required(),
    StartDate:Joi.string().trim().required(),
    EndDate:Joi.string().trim().required()
})


const GetUserAttendenceController=async(req,res)=>{
    const isValidater=schema.validate(req.query);
    
    if(isValidater){
        let {EmpId,TableName,StartDate,EndDate}=req.query;
        
        // Check Query data is valid or not
        if(EmpId && TableName && StartDate && EndDate){
            const AttendenceSql=`select WorkDay,InTime=format(InTime,'hh:mm:ss tt'),OutTime=format(OutTime,'hh:mm:ss tt'),
	        a.IsTiffin,IsIftar,a.IsNight,IsHoliday,IsWeekOff,a.IsLunch,OtHours,
	        AttStatus,InRemarks,OutRemarks,Remarks=InRemarks+' '+OutRemarks,
	        IsLeaveApplied =case when lv.LRId>0 then 1 else 0 end ,
	        IsSDApplied=case when sd.SDId>0 then 1 else 0 end ,
	        IsIOApplied=case when inOut.IOId >0 then 1 else 0 end 
	        from ${TableName} a
	        outer apply (select * from Attendance_LeaveRegister where EmpId=a.EmpID and a.WorkDay between StartDate and EndDate and Status not in(3,4,5) and isnull(IsDeleted,0)=0) lv
	        outer apply (select * from Attendance_EmployeeTour where EmpId=a.EmpID and a.WorkDay between StartDate and EndDate and Status not in(3,4) and isnull(IsDeleted,0)=0) sd
            outer apply (select COUNT(*) AS IOId from Attendance_OfficialInOut where EmpId=a.EmpID and a.WorkDay between InOutDate and InOutDate and Status not in(3,4) and isnull(IsDeleted,0)=0) inOut
	        where a.EmpID=${EmpId} and (WorkDay between '${StartDate}' and '${EndDate}')`;
            const AttendenceData=await getData(res,AttendenceSql);
    
            if(AttendenceData.length){
                return res.status(200).json({IsSuccess:true,data:AttendenceData});
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

module.exports=GetUserAttendenceController;