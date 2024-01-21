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

const GetHourlyProductionController = async (req, res) => {
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


    const sql=`WITH CTE
    AS (SELECT
        A.HourNo as name,
        A.LineId,
        ln.LineName,
        ISNULL(COUNT(ChildBarcode), 0) TotalOk
    FROM HourlySewingProductionCount A with(nolock)
   
    JOIN LineNew ln with(nolock)
        ON ln.LineId = A.LineId
    WHERE A.UnitId = ${UnitId}
    AND CAST(CreateAt AS date) = CAST('${filterDate}' AS date)
    AND InputTypeId = 1
    GROUP BY HourNo,
                A.LineId,
                LineName)

    SELECT
        * INTO #tbl1
    FROM CTE
    ORDER BY name
    SELECT
        CASE
        WHEN name = 1 THEN '9 AM'
        WHEN name = 2 THEN '10 AM'
        WHEN name = 3 THEN '11 AM'
        WHEN name = 4 THEN '12 PM'
        WHEN name = 5 THEN '1 PM'
        WHEN name = 6 THEN '3 PM'
        WHEN name = 7 THEN '4 PM'
        WHEN name = 8 THEN '5 PM'
        WHEN name = 9 THEN '6 PM'
        WHEN name = 10 THEN '7 PM'
        WHEN name = 11 THEN '8 PM'
        WHEN name = 12 THEN '9 PM'
        WHEN name = 13 THEN '10 PM'
        WHEN name = 14 THEN '11 PM'
        WHEN name = 15 THEN '12 AM'
        WHEN name = 16 THEN '1 AM'
        WHEN name = 17 THEN '2 AM'
        WHEN name = 18 THEN '3 AM'
        WHEN name = 19 THEN '4 AM'
        WHEN name = 20 THEN '5 AM'
        WHEN name = 21 THEN '6 AM'
        WHEN name = 22 THEN '7 AM'
        WHEN name = 23 THEN '8 AM'

        ELSE '10 PM'
        END name,
        SUM(TotalOk) ProductionQty
    FROM #tbl1
    GROUP BY name


    DROP TABLE #tbl1`;
    // const sql=`WITH CTE
    // AS (SELECT
    //     A.HourNo as name,
    //     A.LineId,
    //     ln.LineName,
    //     ISNULL(COUNT(ChildBarcode), 0) TotalOk
    // FROM HourlySewingProductionCount A
   
    // JOIN LineNew ln
    //     ON ln.LineId = A.LineId
    // WHERE A.UnitId = ${UnitId}
    // AND CAST(CreateAt AS date) = CAST('2023-9-7' AS date)
    // AND InputTypeId = 1
    // GROUP BY HourNo,
    //             A.LineId,
    //             LineName)

    // SELECT
    //     * INTO #tbl1
    // FROM CTE
    // ORDER BY name
    // SELECT
    //     CASE
    //     WHEN name = 1 THEN '9 AM'
    //     WHEN name = 2 THEN '10 AM'
    //     WHEN name = 3 THEN '11 AM'
    //     WHEN name = 4 THEN '12 PM'
    //     WHEN name = 5 THEN '1 PM'
    //     WHEN name = 6 THEN '3 PM'
    //     WHEN name = 7 THEN '4 PM'
    //     WHEN name = 8 THEN '5 PM'
    //     WHEN name = 9 THEN '6 PM'
    //     WHEN name = 10 THEN '7 PM'
    //     WHEN name = 11 THEN '8 PM'
    //     WHEN name = 12 THEN '9 PM'

    //     ELSE '10 PM'
    //     END name,
    //     SUM(TotalOk) ProductionQty
    // FROM #tbl1
    // GROUP BY name


    // DROP TABLE #tbl1`;
    
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


module.exports = GetHourlyProductionController;
