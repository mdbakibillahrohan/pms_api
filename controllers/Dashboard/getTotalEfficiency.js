/*
* Author: Asib Al Hasan
* Title: Get User Unit With ID
* Description: Jodi user er Admin dashboard permission thke taile tar initiale vabe dashboard er kichu data load korano lagbe . Er jnno tar unit details lagbe . 
* Date: 30 July 2023
*/

const Joi = require("joi");
const {executeSqlB}=require('../../util/db')


const schema = Joi.object().keys({
  UnitId: Joi.number().max(10).required(),
  filterDate:Joi.string().trim().required()
});

const GetTotalEfficiency = async (req, res) => {
  const isValidate = schema.validate(req.query);

  if (isValidate.error) {
    return res.status(400).json({ error: isValidate.error });
  }
  let data = [];
  try {
    const {
      UnitId,
      filterDate
    } = req.query;
    const newDate=new Date();
    const dateString=newDate.getFullYear()+'-'+(newDate.getMonth()+1)+'-'+newDate.getDate();

    // console.log("JKHGJK:",filterDate)
    // console.log("DTERF:",dateString)
    let sql="";

    if(dateString===filterDate){
      sql=`
      select distinct SectionName, SectionId into #sectionTbl from [FactoryDB].[dbo].DeptWiseDailyData 
      where SectionId in (select PreviousId from LineNew where UnitId = ${UnitId}) 
      and Len(SectionName) > 12 

      SELECT LineName as name,TotalTgt, TotalOk,SMV,HorkingMinute,PlantManPower,((CONVERT(DECIMAL(10,2),(TotalOk*SMV)))/(CONVERT(DECIMAL(10,2),(HorkingMinute*PlantManPower))))*100.00 Effiency
      FROM (
      SELECT sec.SectionName LineName,SMV,PlantManPower,ISNULL(count(ChildBarcode),0) TotalOk,T.HourlyTarget,(T.HourlyTarget/60.00)*(datediff(minute, '${filterDate} 08:00:00', GETDATE())) TotalTgt,
      datediff(minute, '${filterDate} 08:00:00', GETDATE()) HorkingMinute
      FROM LineEfficiency ST 
      INNER join StyleWiseTarget T on ST.SWTId=T.SWTId 
      INNER JOIN LineNew LN ON ST.LineId=LN.LineId
      INNER JOIN LineOld LD ON LN.PreviousId=LD.LineId
      LEFT JOIN #sectionTbl sec on sec.SectionId = ld.LineId  
      INNER JOIN HourlySewingProductionCount HP ON HP.LineId=ST.LineId AND HP.UnitId=LD.UnitId AND HP.ProductionDate=T.TargetDate 
      WHERE LD.UnitId=${UnitId} AND T.TargetDate=cast('${filterDate}' as date) AND LD.LineTypeId=1
      GROUP BY LN.LineName,SMV,PlantManPower,T.HourlyTarget,sec.SectionName) AS K
      drop table #sectionTbl`;
    }else{
      sql=`select distinct SectionName, SectionId into #sectionTbl from [FactoryDB].[dbo].DeptWiseDailyData 
      where SectionId in (select PreviousId from LineNew where UnitId = ${UnitId}) 
      and Len(SectionName) > 12 

      SELECT LineName as name,TotalTgt, TotalOk,SMV,HorkingMinute,PlantManPower,((CONVERT(DECIMAL(10,2),(TotalOk*SMV)))/(CONVERT(DECIMAL(10,2),(HorkingMinute*PlantManPower))))*100.00 Effiency
      FROM (
      SELECT sec.SectionName LineName,SMV,PlantManPower,ISNULL(count(ChildBarcode),0) TotalOk,T.HourlyTarget,(T.HourlyTarget/60.00)*(datediff(minute, '${filterDate} 08:00:00', GETDATE())) TotalTgt,
      datediff(minute, '${filterDate} 08:00:00', GETDATE()) HorkingMinute
      FROM LineEfficiency ST 
      INNER join StyleWiseTarget T on ST.SWTId=T.SWTId 
      INNER JOIN LineNew LN ON ST.LineId=LN.LineId
      INNER JOIN LineOld LD ON LN.PreviousId=LD.LineId
      LEFT JOIN #sectionTbl sec on sec.SectionId = ld.LineId  
      INNER JOIN HourlySewingProductionCount HP ON HP.LineId=ST.LineId AND HP.UnitId=LD.UnitId AND HP.ProductionDate=T.TargetDate 
      WHERE LD.UnitId=${UnitId} AND T.TargetDate=cast('${filterDate}' as date) AND LD.LineTypeId=1
      GROUP BY LN.LineName,SMV,PlantManPower,T.HourlyTarget,sec.SectionName) AS K
      drop table #sectionTbl`;
    }

    data = await executeSqlB(sql);

    //console.log(data.recordsets[0])

    if (data.recordset.length > 0) {
      let info=data.recordsets[0];

      return res.status(200).json({IsSuccess:true,data:info});
    }
    return res.status(500).json({
      IsSuccess:false,
      message: "Internal Server Error",
    });
  } catch (error) {
    return res.status(500).send("Internall server error");
  }
};


module.exports = GetTotalEfficiency;
