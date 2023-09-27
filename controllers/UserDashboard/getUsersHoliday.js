const Joi = require("joi");
const {executeSqlB}=require('../../util/db');

const schema=Joi.object().keys({
    EmpCode: Joi.string().trim().min(3).max(10).required()
})


const GetUserHolidaysController=async(req,res)=>{
    const isValidater=schema.validate(req.query);
    
    if(isValidater){
        let {EmpCode}=req.query;
        
        const EmpHrmInfoSql=`Select * from HumanResource_EmployeeBasic where EmpCode=${EmpCode}`;
        const EmpHrmInfoData=await getData(res,EmpHrmInfoSql);

        //console.log(EmpHrmInfoData)
        // Check Data Is Available Or Not?
        if(EmpHrmInfoData.length){
            // Extract UnitId && ReligionID
            let {UnitID,ReligionID}=EmpHrmInfoData[0];

            // UnitId && ReligionID is Valid?
            if(UnitID && ReligionID){
                const HolidaySql=`SELECT HolidayName,MIN(HolidayDate) 'DateFrom',MAX(HolidayDate) 'DateTo',COUNT(HolidayDate) NoOfDays
                FROM HolidayAllocateReligionWise  H
                INNER JOIN Holidays HH ON H.HolidayId=HH.HolidayId
                INNER JOIN HumanResource_EmployeeBasic EB ON EB.UnitID=H.UnitId AND EB.DepartmentID=H.DepartmentID AND EB.ReligionID=H.ReligionId
                INNER JOIN HolidayDetails HD ON HH.HolidayId=HD.HolidayId AND EB.UnitID=HD.UnitId and hd.EmpTypeId=EB.EmpTypeID
                
                WHERE (H.UnitId = ${UnitID} AND H.ReligionId=${ReligionID} AND EmpCode = ${EmpCode}) AND (HD.IsDoublePayment=1 AND (YEAR(HH.HolidayYear) = cast(YEAR(GETDATE()) as varchar(4))))
                GROUP BY HolidayName order by DateFrom asc`;

                const HolidayData=await getData(res,HolidaySql);

                return res.status(200).json({IsSuccess:true,data:HolidayData});

            }else{
                return res.status(500).json({IsSuccess:false,message:"Internal Server Error."})
            }
        }else{
            return res.status(500).json({IsSuccess:false,message:'Internal Server Error.'})
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

module.exports=GetUserHolidaysController;