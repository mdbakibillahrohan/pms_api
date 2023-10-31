const { getData } = require('../../util/dao');
const { dbConfig } = require('../../util/settings');

const styleWiseTargetListServices = async(payload)=>{
    const data = await getStyleWiseTargetList(payload);
    return data;
}

const getStyleWiseTargetList = async (payload)=>{
    const date = getDate(payload, true);
    const {unitId} = payload;
    const query = `select hfic.ProductionDate Date, count(hfic.HFIId) Received, count(hfpc.HFPId) Production from HourlyFinishingInputCount hfic
    left join HourlyFinishingProductionCount hfpc on hfpc.ChildBarcode = hfic.ChildBarcode
    where hfic.ProductionDate >= ${date} and hfic.UnitId = ${unitId} group by hfic.ProductionDate`;
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

module.exports = styleWiseTargetListServices;