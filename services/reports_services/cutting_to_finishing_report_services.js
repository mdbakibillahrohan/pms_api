const {getData} = require('../../util/dao');
const {dbConfig} = require('../../util/settings');

const cuttingToFinishingReportServices = async(payload)=>{
    const data = await getCuttingToFinishingReport(payload);
    return data;
}

const getCuttingToFinishingReport = async(payload)=>{
    const cuttingData = await getCuttingData(payload);
    const sewingData = await getSewingData(payload);
    const washData = await getWashData(payload);
    const finishingData = await getFinishingData(payload);
    return {cuttingData,sewingData, washData, finishingData};
}

const getCuttingData = async(payload)=>{
    const {fromDate, toDate, buyerId, styleId} = payload;
    let query = `select rb.Buyer_name, cs.StyleNo,cast(vc.CutDate as date) CutDate,ccpd.PO,  
                    sum(vc.CuttingQty) CuttingQty from View_Cutting vc
                    inner join CP_Style cs on cs.Id = vc.StyleId
                    inner join Reg_Buyer rb on rb.Buyer_id = cs.Buyer_id
                    left join CP_CuttingPlanDetail ccpd on ccpd.CP_StyleId = cs.Id
                    where 1 = 1`;
    if(fromDate && toDate){
        query += ` and vc.CutDate BETWEEN '${fromDate}' and '${toDate}'`
    }
    if(styleId){
        query += ` and vc.StyleId = ${styleId}`
    }
    if(buyerId){
        query += ` and vc.Buyer_id = ${buyerId}`
    }

    query+=` group by cs.StyleNo, ccpd.PO, vc.CutDate, rb.Buyer_name
    order by vc.CutDate desc`;
    const data = await getData(dbConfig, query);
    return data;
}

const getSewingData = async(payload)=>{
    const {fromDate, toDate, buyerId, styleId} = payload;
    let query = `select hspc.ProductionDate SewingDate, rb.Buyer_name, cs.StyleNo, ccpd.PO, 
                    count(ChildBarcode) SewingQty from HourlySewingProductionCount hspc
                    inner join CP_Style cs on cs.Id = hspc.StyleId
                    inner join Reg_Buyer rb on rb.Buyer_id = cs.Buyer_id
                    left join CP_CuttingPlanDetail ccpd on ccpd.CP_StyleId = cs.Id
                    where 1 = 1`;
    if(fromDate && toDate){
        query += ` and hspc.ProductionDate BETWEEN '${fromDate}' and '${toDate}'`
    }
    if(styleId){
        query += ` and hspc.StyleId = ${styleId}`
    }
    if(buyerId){
        query += ` and cs.Buyer_id = ${buyerId}`
    }
    
    query+=` group by cs.StyleNo, ccpd.PO, hspc.ProductionDate, rb.Buyer_name
    order by hspc.ProductionDate desc`;
    const data = await getData(dbConfig, query);
    return data;
}

const getWashData = async(payload)=>{
    const {fromDate, toDate, buyerId, styleId} = payload;
    let query = `select hwpc.WashDate, rb.Buyer_name, cs.StyleNo, ccpd.PO,
                    count(ChildBarcode) WashQty from HourlyWashProductionCount hwpc 
                    inner join CP_Style cs on cs.Id = hwpc.StyleId
                    inner join Reg_Buyer rb on rb.Buyer_id = cs.Buyer_id
                    left join CP_CuttingPlanDetail ccpd on ccpd.CP_StyleId = cs.Id
                    where 1 = 1 `;
    if(fromDate && toDate){
        query += ` and hwpc.WashDate BETWEEN '${fromDate}' and '${toDate}'`
    }
    if(styleId){
        query += ` and hwpc.StyleId = ${styleId}`
    }
    if(buyerId){
        query += ` and cs.Buyer_id = ${buyerId}`
    }
    
    query+=` group by cs.StyleNo, ccpd.PO, hwpc.WashDate, rb.Buyer_name
    order by hwpc.WashDate desc`;
    const data = await getData(dbConfig, query);
    return data;
}



const getFinishingData = async(payload)=>{
    const {fromDate, toDate, buyerId, styleId} = payload;
    let query = `select hfpc.ProductionDate FinishingDate, rb.Buyer_name, ccpd.PO, 
                    cs.StyleNo, count(ChildBarcode) FinishingQty 
                    from HourlyFinishingProductionCount hfpc 
                    inner join CP_Style cs on cs.Id = hfpc.StyleId
                    inner join Reg_Buyer rb on rb.Buyer_id = cs.Buyer_id
                    left join CP_CuttingPlanDetail ccpd on ccpd.CP_StyleId = cs.Id
                    where 1 = 1`;
    if(fromDate && toDate){
        query += ` and hfpc.ProductionDate BETWEEN '${fromDate}' and '${toDate}'`
    }
    if(styleId){
        query += ` and hfpc.StyleId = ${styleId}`
    }
    if(buyerId){
        query += ` and cs.Buyer_id = ${buyerId}`
    }
    
    query+=` group by cs.StyleNo, ccpd.PO, hfpc.ProductionDate, rb.Buyer_name
    order by hfpc.ProductionDate desc`;
    const data = await getData(dbConfig, query);
    return data;
}

module.exports = cuttingToFinishingReportServices;