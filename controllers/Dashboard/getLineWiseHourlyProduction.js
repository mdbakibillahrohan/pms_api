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

const GetLineWiseHourlyProductionController = async (req, res) => {
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


    const sql=`select  SectionId,SectionName
    into #LinePre
    from [FactoryDB].[dbo].DeptWiseDailyData
    where SectionId in  (
            select ln.PreviousId from LineUnit lu
            join LineNew ln on ln.LineId = lu.LineId
            where UnitId = ${UnitId} and IsActive = 1 and UnitLineName like '%LINE -%') and Len(SectionName) >12
            Group By SectionName, SectionId
            Order By SectionName;
    
    WITH CTE
        AS (SELECT
            A.HourNo,
            A.LineId,
            pl.SectionName LineName,
            ISNULL(COUNT(ChildBarcode), 0) TotalOk
        FROM HourlySewingProductionCount A

        JOIN LineNew ln
            ON ln.LineId = A.LineId
        Join #LinePre pl on pl.SectionId = ln.PreviousId

        WHERE A.UnitId = ${UnitId}
        AND CAST(CreateAt AS date) = CAST('${filterDate}' AS date)
        AND InputTypeId = 1
        GROUP BY HourNo,
                    A.LineId,
                        pl.SectionName
                    ) 
        SELECT
            * INTO #tbl1
        FROM CTE
        ORDER BY LineId

        SELECT
            ROW_NUMBER () over(order by LineId) RowNO,
            HourNo as OHour,
            CASE
            WHEN HourNo = 1 THEN '9 AM'
            WHEN HourNo = 2 THEN '10 AM'
            WHEN HourNo = 3 THEN '11 AM'
            WHEN HourNo = 4 THEN '12 PM'
            WHEN HourNo = 5 THEN '1 PM'
            WHEN HourNo = 6 THEN '3 PM'
            WHEN HourNo = 7 THEN '4 PM'
            WHEN HourNo = 8 THEN '5 PM'
            WHEN HourNo = 9 THEN '6 PM'
            WHEN HourNo = 10 THEN '7 PM'
            WHEN HourNo = 11 THEN '8 PM'
            WHEN HourNo = 12 THEN '9 PM'

            ELSE '10 PM'
            END HourNo,
            LineId,
            LineName,
            Sum(TotalOk) ProductionQty
        
        FROM #tbl1
        GROUP BY LineId,LineName,HourNo

        DROP TABLE #LinePre
        DROP TABLE #tbl1`;

    // const sql=`select  SectionId,SectionName
    // into #LinePre
    // from [FactoryDB].[dbo].DeptWiseDailyData
    // where SectionId in  (
    //         select ln.PreviousId from LineUnit lu
    //         join LineNew ln on ln.LineId = lu.LineId
    //         where UnitId = ${UnitId} and IsActive = 1 and UnitLineName like '%LINE -%') and Len(SectionName) >12
    //         Group By SectionName, SectionId
    //         Order By SectionName;
    
    // WITH CTE
    //     AS (SELECT
    //         A.HourNo,
    //         A.LineId,
    //         pl.SectionName LineName,
    //         ISNULL(COUNT(ChildBarcode), 0) TotalOk
    //     FROM HourlySewingProductionCount A

    //     JOIN LineNew ln
    //         ON ln.LineId = A.LineId
    //     Join #LinePre pl on pl.SectionId = ln.PreviousId

    //     WHERE A.UnitId = ${UnitId}
    //     AND CAST(CreateAt AS date) = CAST('2023-9-7' AS date)
    //     AND InputTypeId = 1
    //     GROUP BY HourNo,
    //                 A.LineId,
    //                     pl.SectionName
    //                 ) 
    //     SELECT
    //         * INTO #tbl1
    //     FROM CTE
    //     ORDER BY LineId

    //     SELECT
    //         ROW_NUMBER () over(order by LineId) RowNO,
    //         HourNo as OHour,
    //         CASE
    //         WHEN HourNo = 1 THEN '9 AM'
    //         WHEN HourNo = 2 THEN '10 AM'
    //         WHEN HourNo = 3 THEN '11 AM'
    //         WHEN HourNo = 4 THEN '12 PM'
    //         WHEN HourNo = 5 THEN '1 PM'
    //         WHEN HourNo = 6 THEN '3 PM'
    //         WHEN HourNo = 7 THEN '4 PM'
    //         WHEN HourNo = 8 THEN '5 PM'
    //         WHEN HourNo = 9 THEN '6 PM'
    //         WHEN HourNo = 10 THEN '7 PM'
    //         WHEN HourNo = 11 THEN '8 PM'
    //         WHEN HourNo = 12 THEN '9 PM'

    //         ELSE '10 PM'
    //         END HourNo,
    //         LineId,
    //         LineName,
    //         Sum(TotalOk) ProductionQty
        
    //     FROM #tbl1
    //     GROUP BY LineId,LineName,HourNo

    //     DROP TABLE #LinePre
    //     DROP TABLE #tbl1`;
    
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


module.exports = GetLineWiseHourlyProductionController;
