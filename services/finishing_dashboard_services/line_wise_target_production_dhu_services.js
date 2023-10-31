
const { getData } = require('../../util/dao');
const { dbConfig } = require('../../util/settings');

const lineWiseTargetProductionDHUServices = async (payload)=>{
    const data = await getLineWiseTargetProductionDHU(payload);
    return data;
}

const getLineWiseTargetProductionDHU = async (payload)=>{
    const {unitId} = payload;
    const date = getDate(payload);
    const query = `select ln.LineName, count(hfpc.ChildBarcode) Production, sum((swft.HourlyTarget*8)) Target,
    ((select count(ChildBarcode) Defect from HourlyFinishingDefectCount with(nolock) where ProductionDate = ${date} and SewingLineId = ln.LineId)/count(hfpc.ChildBarcode)*100) DHU
    from HourlyFinishingProductionCount hfpc with(nolock)
    left join StyleWiseFinishingTarget swft with(nolock) on swft.StyleId = hfpc.StyleId
    left join LineNew ln with(nolock) on ln.LineId = hfpc.SewingLineId 
    where hfpc.ProductionDate = ${date} and hfpc.UnitId = ${unitId}
    group by LineName, ln.LineId`;
    const data = await getData(dbConfig, query);
    return data;
}

const getDate = (payload, isWeekly = false)=>{
    if(isWeekly){
        return "CAST(DATEADD(day,-7, GETDATE()) as date)";
    }
    const {date} = payload;
    if(date){
        return `'${date}'`;
    }
    return "CAST(GETDATE() as date)";
}

module.exports = lineWiseTargetProductionDHUServices;