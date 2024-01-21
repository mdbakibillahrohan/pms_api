/*
* Author: Asib Al Hasan
* Title: Get User Unit With ID
* Description: Jodi user er Admin dashboard permission thke taile tar initiale vabe dashboard er kichu data load korano lagbe . Er jnno tar unit details lagbe . 
* Date: 30 July 2023
*/

const Joi = require("joi");
const {executeSqlB}=require('../../util/db')
const 
  calcTime
=require('../../util/method')


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
    const myDated=calcTime(6);
    const {
      hour,
      second,
      minute
    }=myDated;
    console.log(myDated)


    // console.log("JKHGJK:",filterDate)
    // console.log("DTERF:",dateString)
    let sql="";

    if(hour==13){
      sql=`SELECT LineName as name,TotalTgt, TotalOk,SMV,HorkingMinute,PlantManPower,((CONVERT(DECIMAL(10,2),(TotalOk*SMV)))/(CONVERT(DECIMAL(10,2),(HorkingMinute*PlantManPower))))*100.00 Effiency
      FROM (
      SELECT LN.LineName,SMV,PlantManPower,ISNULL(count(ChildBarcode),0) TotalOk,T.HourlyTarget,(T.HourlyTarget/60.00)*(datediff(minute, '${filterDate} 08:00:00', '${filterDate} 13:0:0')) TotalTgt,
      datediff(minute, '${filterDate} 08:00:00', '${filterDate} 13:0:0') HorkingMinute
      FROM LineEfficiency ST 
      INNER join StyleWiseTarget T on ST.SWTId=T.SWTId 
      INNER JOIN LineNew LN ON ST.LineId=LN.LineId
      INNER JOIn LineOld LD ON LN.PreviousId=LD.LineId  
      INNER JOIN HourlySewingProductionCount HP ON HP.LineId=ST.LineId AND HP.UnitId=LD.UnitId AND HP.ProductionDate=T.TargetDate 
      WHERE LD.UnitId=${UnitId} AND T.TargetDate=cast('${filterDate}' as date) AND LD.LineTypeId=1
      GROUP BY LN.LineName,SMV,PlantManPower,T.HourlyTarget) AS K`
    }else if(hour>13){
      // sql=`SELECT LineName as name,TotalTgt, TotalOk,SMV,PlantManPower,((CONVERT(DECIMAL(10,2),(TotalOk*SMV)))/(CONVERT(DECIMAL(10,2),(HorkingMinute*PlantManPower))))*100.00 Effiency
      // FROM (
      // SELECT LN.LineName,SMV,PlantManPower,ISNULL(count(ChildBarcode),0) TotalOk,T.HourlyTarget,(T.HourlyTarget/60.00)*(datediff(minute, '${filterDate} 08:00:00', MAX(HP.CreateAt))) TotalTgt,
      // (datediff(minute, '${filterDate} 08:00:00', MAX(HP.CreateAt))) HorkingMinute
      // FROM LineEfficiency ST 
      // INNER join StyleWiseTarget T on ST.SWTId=T.SWTId 
      // INNER JOIN LineNew LN ON ST.LineId=LN.LineId
      // INNER JOIn LineOld LD ON LN.PreviousId=LD.LineId  
      // INNER JOIN HourlySewingProductionCount HP ON HP.LineId=ST.LineId AND HP.UnitId=LD.UnitId AND HP.ProductionDate=T.TargetDate 
      // WHERE LD.UnitId=7 AND T.TargetDate=cast('${filterDate}' as date) AND LD.LineTypeId=1
      // GROUP BY LN.LineName,SMV,PlantManPower,T.HourlyTarget) AS K`

      sql=`SELECT LineName as name,TotalTgt, TotalOk,SMV,HorkingMinute,PlantManPower,((CONVERT(DECIMAL(10,2),(TotalOk*SMV)))/(CONVERT(DECIMAL(10,2),(HorkingMinute*PlantManPower))))*100.00 Effiency
      FROM (
      SELECT LN.LineName,SMV,PlantManPower,ISNULL(count(ChildBarcode),0) TotalOk,T.HourlyTarget,(T.HourlyTarget/60.00)*(datediff(minute, '${filterDate} 08:00:00', GETDATE())) TotalTgt,
      datediff(minute, '${filterDate} 08:00:00',  '${filterDate} ${hour-1}:${minute}:${second}') HorkingMinute
      FROM LineEfficiency ST 
      INNER join StyleWiseTarget T on ST.SWTId=T.SWTId 
      INNER JOIN LineNew LN ON ST.LineId=LN.LineId
      INNER JOIn LineOld LD ON LN.PreviousId=LD.LineId  
      INNER JOIN HourlySewingProductionCount HP ON HP.LineId=ST.LineId AND HP.UnitId=LD.UnitId AND HP.ProductionDate=T.TargetDate 
      WHERE LD.UnitId=${UnitId} AND T.TargetDate=cast('${filterDate}' as date) AND LD.LineTypeId=1
      GROUP BY LN.LineName,SMV,PlantManPower,T.HourlyTarget) AS K`
    }else{
      sql=`SELECT LineName as name,TotalTgt, TotalOk,SMV,HorkingMinute,PlantManPower,((CONVERT(DECIMAL(10,2),(TotalOk*SMV)))/(CONVERT(DECIMAL(10,2),(HorkingMinute*PlantManPower))))*100.00 Effiency
      FROM (
      SELECT LN.LineName,SMV,PlantManPower,ISNULL(count(ChildBarcode),0) TotalOk,T.HourlyTarget,(T.HourlyTarget/60.00)*(datediff(minute, '${filterDate} 08:00:00', '${filterDate} ${hour-1}:${minute}:${second}')) TotalTgt,
      datediff(minute, '${filterDate} 08:00:00', GETDATE()) HorkingMinute
      FROM LineEfficiency ST 
      INNER join StyleWiseTarget T on ST.SWTId=T.SWTId 
      INNER JOIN LineNew LN ON ST.LineId=LN.LineId
      INNER JOIn LineOld LD ON LN.PreviousId=LD.LineId  
      INNER JOIN HourlySewingProductionCount HP ON HP.LineId=ST.LineId AND HP.UnitId=LD.UnitId AND HP.ProductionDate=T.TargetDate 
      WHERE LD.UnitId=${UnitId} AND T.TargetDate=cast('${filterDate}' as date) AND LD.LineTypeId=1
      GROUP BY LN.LineName,SMV,PlantManPower,T.HourlyTarget) AS K`
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
