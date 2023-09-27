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

const GetRunningStyleDetailsController = async (req, res) => {
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


    const sql=`select 
    A.StyleId OutStyleId
    into #tblOutToday
    from 
        HourlySewingProductionCount A 

        join LineNew ln on ln.LineId = A.LineId 
    where 
        A.UnitId =${UnitId}
        and cast(CreateAt as date) = cast(
        '${filterDate}' as date
        ) 
        and InputTypeId = 1 
    group by 
        A.StyleId

    select 
        today.*,
        ISNULL(count(hs.ChildBarcode),0) TTLOut
    into #tblOut
    from
        #tblOutToday today 
    join	HourlySewingProductionCount hs on hs.StyleId = today.OutStyleId and hs.InputTypeId = 1
    group by  
    today.OutStyleId

    select 
    b.Buyer_name BuyerName, 
    s.StyleNo, 
    Sum(a.BundleQty) TTLInput, 
    c.StyleId StyleIdIn, 
    b.Buyer_id 
    into #tblIn
    from 
    Cutting_BundleLineInput a 
    join Cutting c on c.CuttingId = a.CuttingId 
    JOIN #tblOutToday os ON os.OutStyleId = c.StyleId 
    JOIN CP_Style s ON s.Id = os.OutStyleId 
    join hameem_erp_New.dbo.Reg_Buyer b ON b.Buyer_id = c.Buyer_id 
    where 
    a.UnitId = ${UnitId}						 
    group by 
    b.Buyer_name, 
    StyleNo, 
    c.StyleId,
    b.Buyer_id 


    select  *, 
    ISNULL((SELECT SUM(OrderQty) 
            FROM CP_CuttingPlanPODetail CPPOD 
            WHERE 
            CPPOD.CuttingPlanDetailId IN (
                    SELECT 
                    CPD.Id 
                    FROM 
                    CP_CuttingPlanDetail CPD 
                    WHERE 
                    CPD.CP_StyleId IN (
                        SELECT 
                        CPS.Id 
                        FROM 
                        CP_Style CPS 
                        WHERE 
                        CPS.Buyer_id = A.Buyer_id 
                        AND CPS.Id = A.StyleIdIn
                    )
                )
            ), 
            0
            ) AS OrderQty, 
            (
            select 
                sum(CuttingQty) 
            from 
                View_Cutting_New 
            WHERE 
                Buyer_id = A.Buyer_id 
                AND StyleId = A.StyleIdIn 
            ) CuttingQty,
            WIP = TTLInput - TTLOut
                            
    Into #tblJoin1
    from 
    #tblIn A join #tblOut B on  B.OutStyleId = A.StyleIdIn

    select * ,InputBlance =CuttingQty - TTLInput  from  #tblJoin1


    drop table #tblOutToday
    drop table #tblOut
    drop table #tblIn
    drop table #tblJoin1`;

    // const sql=`select 
    // A.StyleId OutStyleId
    // into #tblOutToday
    // from 
    //     HourlySewingProductionCount A 

    //     join LineNew ln on ln.LineId = A.LineId 
    // where 
    //     A.UnitId =${UnitId}
    //     and cast(CreateAt as date) = cast(
    //     '2023-9-7' as date
    //     ) 
    //     and InputTypeId = 1 
    // group by 
    //     A.StyleId

    // select 
    //     today.*,
    //     ISNULL(count(hs.ChildBarcode),0) TTLOut
    // into #tblOut
    // from
    //     #tblOutToday today 
    // join	HourlySewingProductionCount hs on hs.StyleId = today.OutStyleId and hs.InputTypeId = 1
    // group by  
    // today.OutStyleId

    // select 
    // b.Buyer_name BuyerName, 
    // s.StyleNo, 
    // Sum(a.BundleQty) TTLInput, 
    // c.StyleId StyleIdIn, 
    // b.Buyer_id 
    // into #tblIn
    // from 
    // Cutting_BundleLineInput a 
    // join Cutting c on c.CuttingId = a.CuttingId 
    // JOIN #tblOutToday os ON os.OutStyleId = c.StyleId 
    // JOIN CP_Style s ON s.Id = os.OutStyleId 
    // join hameem_erp_New.dbo.Reg_Buyer b ON b.Buyer_id = c.Buyer_id 
    // where 
    // a.UnitId = ${UnitId}						 
    // group by 
    // b.Buyer_name, 
    // StyleNo, 
    // c.StyleId,
    // b.Buyer_id 


    // select  *, 
    // ISNULL((SELECT SUM(OrderQty) 
    //         FROM CP_CuttingPlanPODetail CPPOD 
    //         WHERE 
    //         CPPOD.CuttingPlanDetailId IN (
    //                 SELECT 
    //                 CPD.Id 
    //                 FROM 
    //                 CP_CuttingPlanDetail CPD 
    //                 WHERE 
    //                 CPD.CP_StyleId IN (
    //                     SELECT 
    //                     CPS.Id 
    //                     FROM 
    //                     CP_Style CPS 
    //                     WHERE 
    //                     CPS.Buyer_id = A.Buyer_id 
    //                     AND CPS.Id = A.StyleIdIn
    //                 )
    //             )
    //         ), 
    //         0
    //         ) AS OrderQty, 
    //         (
    //         select 
    //             sum(CuttingQty) 
    //         from 
    //             View_Cutting_New 
    //         WHERE 
    //             Buyer_id = A.Buyer_id 
    //             AND StyleId = A.StyleIdIn 
    //         ) CuttingQty,
    //         WIP = TTLInput - TTLOut
                            
    // Into #tblJoin1
    // from 
    // #tblIn A join #tblOut B on  B.OutStyleId = A.StyleIdIn

    // select * ,InputBlance =CuttingQty - TTLInput  from  #tblJoin1


    // drop table #tblOutToday
    // drop table #tblOut
    // drop table #tblIn
    // drop table #tblJoin1`;
    
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


module.exports = GetRunningStyleDetailsController;
