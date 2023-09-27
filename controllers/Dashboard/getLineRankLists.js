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

const GetLineRankListsController = async (req, res) => {
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


    // const sql=`select  SectionId,SectionName
    // into #LinePre
    // from [FactoryDB].[dbo].DeptWiseDailyData
    // where SectionId in  (
    //         select ln.PreviousId from LineUnit lu
    //         join LineNew ln on ln.LineId = lu.LineId
    //         where UnitId = ${UnitId} and IsActive = 1 and UnitLineName like '%LINE -%') and Len(SectionName) >12
    //         Group By SectionName, SectionId
    //         Order By SectionName;
    
    
    
    // with todayOutput as (
    //     select 
    //         Max(HourNo) CurrentHourNo, 
    //         A.LineId, 
    //         pl.SectionName LineName,
    //         A.StyleId OutStyleId, 
    //         ISNULL(
    //         count(a.ChildBarcode), 
    //         0
    //         ) TotalOk, 
    //         B.TargetQty
    
    //     from 
    //         HourlySewingProductionCount A 
    //         INNER JOIN HourlyProduction B On A.LineId = B.LineId 
    //         AND A.ProductionDate = B.ProductionDate 
    //         join LineNew ln on ln.LineId = A.LineId 
    //         Join #LinePre pl on pl.SectionId = ln.PreviousId
    
    //     where 
    //         A.UnitId = ${UnitId}
    //         and cast(CreateAt as date) = cast(
    //         '2023-9-7' as date
    //         ) 
    //         and A.InputTypeId = 1 
    //     group by 
    //         A.StyleId, 
    //         A.LineId, 
    //         TargetQty, 
    //         pl.SectionName
    
    // )
    // Select *
    //     into #tbl1
    // from (select 
    //         CurrentHourNo,
    //         LineId, 
    //         LineName, 
    //         OutStyleId, 
    //         TotalOk, 
    //         TargetQty,
    //         ROW_NUMBER() OVER (PARTITION BY LineId ORDER BY CurrentHourNo DESC) AS row_num
    //      from todayOutput)t Where t.row_num = 1
    
    
    // select 
    //     ISNULL(count(ChildBarcode), 0) TotalOk,
    //     A.LineId LineIdOut,
    //     A.OutStyleId,
    //     A.LineName,
    //     A.TargetQty,A.CurrentHourNo
    // into #tblOut
    // from #tbl1 A
    //     join HourlySewingProductionCount B on B.LineId = a.LineId and A.OutStyleId = b.StyleId and B.InputTypeId = 1
    //     Group by A.LineId, A.OutStyleId,A.LineName,A.TargetQty,A.CurrentHourNo
    
    // select 
    //     b.Buyer_name BuyerName, 
    //     s.StyleNo, 
    //     a.LineId InLineId,
    //     Sum(a.BundleQty) InputBlance1, 
    //     c.StyleId StyleIdIn, 
    //     b.Buyer_id 
    // into #tblIn
    // from 
    //     Cutting_BundleLineInput a 
    //     join Cutting c on c.CuttingId = a.CuttingId 
    //     join hameem_erp_New.dbo.Reg_Buyer b ON b.Buyer_id = c.Buyer_id 
    //     JOIN #tbl1 os ON os.OutStyleId = c.StyleId 
    //     JOIN CP_Style s ON s.Id = os.OutStyleId 
    //     and c.Buyer_id = b.Buyer_id
    // where 
    //     a.UnitId = ${UnitId}							 
    // group by 
    //     a.LineId,
    //     b.Buyer_name, 
    //     StyleNo, 
    //     c.StyleId,
    //     b.Buyer_id 
    
    
    // select  *, 
    //     ISNULL((SELECT SUM(OrderQty) 
    //             FROM CP_CuttingPlanPODetail CPPOD 
    //             WHERE 
    //             CPPOD.CuttingPlanDetailId IN (
    //                     SELECT 
    //                     CPD.Id 
    //                     FROM 
    //                     CP_CuttingPlanDetail CPD 
    //                     WHERE 
    //                     CPD.CP_StyleId IN (
    //                         SELECT 
    //                         CPS.Id 
    //                         FROM 
    //                         CP_Style CPS 
    //                         WHERE 
    //                         CPS.Buyer_id = Buyer_id 
    //                         AND CPS.Id = A.StyleIdIn
    //                     )
    //                 )
    //             ), 
    //             0
    //             ) AS OrderQty, 
    //             (
    //             select 
    //                 sum(CuttingQty) 
    //             from 
    //                 View_Cutting_New 
    //             WHERE 
    //                 Buyer_id = Buyer_id 
    //                 AND StyleId = StyleId 
    //             ) CuttingQty
                                 
    //     Into #tblJoin1
    // from 
    //     #tblIn A join #tblOut B on B.LineIdOut = A.InLineId and B.OutStyleId = A.StyleIdIn
                                 
    //         select 
    //         j.Buyer_id,
    //         j.BuyerName,
    //         j.StyleIdIn,
    //         j.StyleNo,
    //         j.CuttingQty,
    //         j.OrderQty,
    //         j.CurrentHourNo,
    //         j.InLineId,
    //         j.LineName,
    //         j.TargetQty,
    //         j.TotalOk,
    //         j.InputBlance1,
    //         ISNULL(count(ChildBarcode), 0) DayOutput
    //         Into #tblJoin
    //         from 
    //         HourlySewingProductionCount hp join #tblJoin1 j on  hp.LineId = j.LineIdOut --and hp.StyleId = j.OutStyleId
    //         where 
    //         UnitId = ${UnitId} and cast(CreateAt as date) = cast('2023-9-7' as date) and InputTypeId = 1 
    //         group by j.Buyer_id,
    //         j.BuyerName,
    //         j.StyleIdIn,
    //         j.StyleNo,
    //         j.CuttingQty,
    //         j.OrderQty,
    //         j.CurrentHourNo,
    //         j.InLineId,
    //         j.LineName,
    //         j.TargetQty,
    //         j.TotalOk,
    //         j.InputBlance1

    //     select  *, 
    //         WIP = InputBlance1 - TotalOk,
    //         Achievement = (DayOutput * 100)/(TargetQty * CurrentHourNo)
    //         into #tblRank
    //     from 
    //         #tblJoin
    //     select 
    //         *, 
    //         ROW_NUMBER() OVER (
    //         order by 
    //             Achievement DESC
    //         ) Rankno 
    //     from 
    //         #tblRank R 
    //         join (
    //         select 
    //             A.LineId, 
    //             ISNULL(
    //             count(ChildBarcode), 
    //             0
    //             ) MonthlyProduction 
    //         from 
    //             HourlySewingProductionCount A 
    //             INNER JOIN HourlyProduction B On A.LineId = B.LineId -- and  A.StyleId = b.StyleId
    //             AND A.ProductionDate = B.ProductionDate 
    //             join LineNew ln on ln.LineId = A.LineId 
    //         where 
    //             A.UnitId = ${UnitId}
    //             and cast(CreateAt as date) between DATEFROMPARTS(
    //             YEAR(
    //                 '2023-9-7'
    //             ), 
    //             MONTH(
    //                 '2023-9-7'
    //             ), 
    //             1
    //             ) 
    //             and cast(
    //             '2023-9-7' as date
    //             ) 
    //             and InputTypeId = 1 
    //         group by 
    //             A.LineId
    //         ) l on l.LineId = R.InLineId 
    //     drop 
    //         table #tblIn 
    //     drop 
    //         table #tbl1 
    //     drop 
    //         table #tblOut 
    //         drop 
    //         table #tblJoin1 
    //     drop 
    //         table #tblJoin 
    //     drop 
    //         table #tblRank
    //     drop 
    //         table #LinePre`;

            const sql=`select  SectionId,SectionName
    into #LinePre
    from [FactoryDB].[dbo].DeptWiseDailyData
    where SectionId in  (
            select ln.PreviousId from LineUnit lu
            join LineNew ln on ln.LineId = lu.LineId
            where UnitId = ${UnitId} and IsActive = 1 and UnitLineName like '%LINE -%') and Len(SectionName) >12
            Group By SectionName, SectionId
            Order By SectionName;
    
    
    
    with todayOutput as (
        select 
            Max(HourNo) CurrentHourNo, 
            A.LineId, 
            pl.SectionName LineName,
            A.StyleId OutStyleId, 
            ISNULL(
            count(a.ChildBarcode), 
            0
            ) TotalOk, 
            B.TargetQty
    
        from 
            HourlySewingProductionCount A 
            INNER JOIN HourlyProduction B On A.LineId = B.LineId 
            AND A.ProductionDate = B.ProductionDate 
            join LineNew ln on ln.LineId = A.LineId 
            Join #LinePre pl on pl.SectionId = ln.PreviousId
    
        where 
            A.UnitId = ${UnitId}
            and cast(CreateAt as date) = cast(
            '${filterDate}' as date
            ) 
            and A.InputTypeId = 1 
        group by 
            A.StyleId, 
            A.LineId, 
            TargetQty, 
            pl.SectionName
    
    )
    Select *
        into #tbl1
    from (select 
            CurrentHourNo,
            LineId, 
            LineName, 
            OutStyleId, 
            TotalOk, 
            TargetQty,
            ROW_NUMBER() OVER (PARTITION BY LineId ORDER BY CurrentHourNo DESC) AS row_num
         from todayOutput)t Where t.row_num = 1
    
    
    select 
        ISNULL(count(ChildBarcode), 0) TotalOk,
        A.LineId LineIdOut,
        A.OutStyleId,
        A.LineName,
        A.TargetQty,A.CurrentHourNo
    into #tblOut
    from #tbl1 A
        join HourlySewingProductionCount B on B.LineId = a.LineId and A.OutStyleId = b.StyleId and B.InputTypeId = 1
        Group by A.LineId, A.OutStyleId,A.LineName,A.TargetQty,A.CurrentHourNo
    
    select 
        b.Buyer_name BuyerName, 
        s.StyleNo, 
        a.LineId InLineId,
        Sum(a.BundleQty) InputBlance1, 
        c.StyleId StyleIdIn, 
        b.Buyer_id 
    into #tblIn
    from 
        Cutting_BundleLineInput a 
        join Cutting c on c.CuttingId = a.CuttingId 
        join hameem_erp_New.dbo.Reg_Buyer b ON b.Buyer_id = c.Buyer_id 
        JOIN #tbl1 os ON os.OutStyleId = c.StyleId 
        JOIN CP_Style s ON s.Id = os.OutStyleId 
        and c.Buyer_id = b.Buyer_id
    where 
        a.UnitId = ${UnitId}							 
    group by 
        a.LineId,
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
                            CPS.Buyer_id = Buyer_id 
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
                    Buyer_id = Buyer_id 
                    AND StyleId = StyleId 
                ) CuttingQty
                                 
        Into #tblJoin1
    from 
        #tblIn A join #tblOut B on B.LineIdOut = A.InLineId and B.OutStyleId = A.StyleIdIn
                                 
            select 
            j.Buyer_id,
            j.BuyerName,
            j.StyleIdIn,
            j.StyleNo,
            j.CuttingQty,
            j.OrderQty,
            j.CurrentHourNo,
            j.InLineId,
            j.LineName,
            j.TargetQty,
            j.TotalOk,
            j.InputBlance1,
            ISNULL(count(ChildBarcode), 0) DayOutput
            Into #tblJoin
            from 
            HourlySewingProductionCount hp join #tblJoin1 j on  hp.LineId = j.LineIdOut --and hp.StyleId = j.OutStyleId
            where 
            UnitId = ${UnitId} and cast(CreateAt as date) = cast('${filterDate}' as date) and InputTypeId = 1 
            group by j.Buyer_id,
            j.BuyerName,
            j.StyleIdIn,
            j.StyleNo,
            j.CuttingQty,
            j.OrderQty,
            j.CurrentHourNo,
            j.InLineId,
            j.LineName,
            j.TargetQty,
            j.TotalOk,
            j.InputBlance1

        select  *, 
            WIP = InputBlance1 - TotalOk,
            Achievement = (DayOutput * 100)/(TargetQty * CurrentHourNo)
            into #tblRank
        from 
            #tblJoin
        select 
            *, 
            ROW_NUMBER() OVER (
            order by 
                Achievement DESC
            ) Rankno 
        from 
            #tblRank R 
            join (
            select 
                A.LineId, 
                ISNULL(
                count(ChildBarcode), 
                0
                ) MonthlyProduction 
            from 
                HourlySewingProductionCount A 
                INNER JOIN HourlyProduction B On A.LineId = B.LineId -- and  A.StyleId = b.StyleId
                AND A.ProductionDate = B.ProductionDate 
                join LineNew ln on ln.LineId = A.LineId 
            where 
                A.UnitId = ${UnitId}
                and cast(CreateAt as date) between DATEFROMPARTS(
                YEAR(
                    '${filterDate}'
                ), 
                MONTH(
                    '${filterDate}'
                ), 
                1
                ) 
                and cast(
                '${filterDate}' as date
                ) 
                and InputTypeId = 1 
            group by 
                A.LineId
            ) l on l.LineId = R.InLineId 
        drop 
            table #tblIn 
        drop 
            table #tbl1 
        drop 
            table #tblOut 
            drop 
            table #tblJoin1 
        drop 
            table #tblJoin 
        drop 
            table #tblRank
        drop 
          table #LinePre`;
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


module.exports = GetLineRankListsController;
