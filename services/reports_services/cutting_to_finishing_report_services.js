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
    const dateQuery = getDateQuery("cutting", payload);
    let query = `select rb.Buyer_name, cs.StyleNo, sum(ccppod.OrderQty) OrderQty, ${dateQuery[0]} ccpd.PO,  
                    sum(vc.CuttingQty) CuttingQty from View_Cutting vc
                    inner join CP_Style cs on cs.Id = vc.StyleId
                    inner join Reg_Buyer rb on rb.Buyer_id = cs.Buyer_id
                    left join CP_CuttingPlanDetail ccpd on ccpd.CP_StyleId = cs.Id
                    left join CP_CuttingPlanPODetail ccppod on ccppod.CuttingPlanDetailId = ccpd.Id
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

    query+=` group by cs.StyleNo, ccpd.PO, ${dateQuery[1]} rb.Buyer_name`;
    const data = await getData(dbConfig, query);
    return data;
}

const getSewingData = async(payload)=>{
    const dateQuery = getDateQuery("sewing", payload);
    const {fromDate, toDate, buyerId, styleId} = payload;
    let query = `select ${dateQuery[0]} sum(ccppod.OrderQty) OrderQty, rb.Buyer_name, cs.StyleNo, ccpd.PO, 
                    count(ChildBarcode) SewingQty from HourlySewingProductionCount hspc
                    inner join CP_Style cs on cs.Id = hspc.StyleId
                    inner join Reg_Buyer rb on rb.Buyer_id = cs.Buyer_id
                    left join CP_CuttingPlanDetail ccpd on ccpd.CP_StyleId = cs.Id
                    left join CP_CuttingPlanPODetail ccppod on ccppod.CuttingPlanDetailId = ccpd.Id
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
    
    query+=` group by cs.StyleNo, ccpd.PO, ${dateQuery[1]} rb.Buyer_name`;
    const data = await getData(dbConfig, query);
    return data;
}

const getWashData = async(payload)=>{
    const dateQuery = getDateQuery("washing", payload);
    const {fromDate, toDate, buyerId, styleId} = payload;
    let query = `select ${dateQuery[0]} rb.Buyer_name, sum(ccppod.OrderQty) OrderQty, cs.StyleNo, ccpd.PO,
                    count(ChildBarcode) WashQty from HourlyWashProductionCount hwpc 
                    inner join CP_Style cs on cs.Id = hwpc.StyleId
                    inner join Reg_Buyer rb on rb.Buyer_id = cs.Buyer_id
                    left join CP_CuttingPlanDetail ccpd on ccpd.CP_StyleId = cs.Id
                    left join CP_CuttingPlanPODetail ccppod on ccppod.CuttingPlanDetailId = ccpd.Id
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
    
    query+=` group by cs.StyleNo, ccpd.PO, ${dateQuery[1]} rb.Buyer_name`;
    const data = await getData(dbConfig, query);
    return data;
}

const getFinishingData = async(payload)=>{
    const dateQuery = getDateQuery("finishing", payload);
    const {fromDate, toDate, buyerId, styleId} = payload;
    let query = `select ${dateQuery[0]} sum(ccppod.OrderQty) OrderQty, rb.Buyer_name, ccpd.PO, 
                    cs.StyleNo, count(ChildBarcode) FinishingQty 
                    from HourlyFinishingProductionCount hfpc 
                    inner join CP_Style cs on cs.Id = hfpc.StyleId
                    inner join Reg_Buyer rb on rb.Buyer_id = cs.Buyer_id
                    left join CP_CuttingPlanDetail ccpd on ccpd.CP_StyleId = cs.Id
                    left join CP_CuttingPlanPODetail ccppod on ccppod.CuttingPlanDetailId = ccpd.Id
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
    
    query+=` group by cs.StyleNo, ccpd.PO, ${dateQuery[1]} rb.Buyer_name`;
    const data = await getData(dbConfig, query);
    return data;
}


const getDateQuery = (stack, payload)=>{
    if(payload.isDate){
        let query = null;
        if(stack==="cutting"){
            query[0] = ` cast(vc.CutDate as date) CutDate,`;
            query[1] = ` vc.CutDate,`
        }else if(stack==="sewing"){
            query[0] = ` hspc.ProductionDate SewingDate,`;
            query[1] = ` hspc.ProductionDate,`
        }else if(stack==="washing"){
            query[0] = ` hwpc.WashDate,`;
            query[1] = ` hwpc.WashDate,`
        }else if(stack==="finishing"){
            query[0] = ` hfpc.ProductionDate FinishingDate,`;
            query[1] = ` hfpc.ProductionDate,`
        }else{
            query = "";
        }
        return query;
    }else{
        return ["", ""];
    }
    
}

module.exports = cuttingToFinishingReportServices;