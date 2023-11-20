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

const GetTargetProductionController = async (req, res) => {
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


    const sql=`WITH CTE  AS (select A.HourNo,A.LineId,ln.LineName ,ISNULL(count(ChildBarcode),0) TotalOk,B.TargetQty from HourlySewingProductionCount A 
    INNER JOIN HourlyProduction B On A.LineId=B.LineId AND A.ProductionDate=B.ProductionDate 
    join LineNew ln on ln.LineId = A.LineId
    where A.UnitId=${UnitId}  and cast(CreateAt as date) = cast('${filterDate}' as date) and InputTypeId=1
    group by HourNo,A.LineId,TargetQty,LineName)
    SELECT LineName as name,SUM(TotalOk) ProductionQty,SUM(TargetQty) TargetQty FROM CTE GROUP BY LineName`;

    // const sql=`WITH CTE  AS (select A.HourNo,A.LineId,ln.LineName ,ISNULL(count(ChildBarcode),0) TotalOk,B.TargetQty from HourlySewingProductionCount A 
    // INNER JOIN HourlyProduction B On A.LineId=B.LineId AND A.ProductionDate=B.ProductionDate 
    // join LineNew ln on ln.LineId = A.LineId
    // where A.UnitId=${UnitId}  and cast(CreateAt as date) = cast('2023-9-7' as date) and InputTypeId=1
    // group by HourNo,A.LineId,TargetQty,LineName)
    // SELECT LineName as name,SUM(TotalOk) ProductionQty,SUM(TargetQty) TargetQty FROM CTE GROUP BY LineName`;
    
    data = await executeSqlB(sql);

    console.log(data.recordsets[0])

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


module.exports = GetTargetProductionController;
