
const { getData } = require('../../util/dao');
const { dbConfig } = require('../../util/settings');

const totalProductionServices = async (payload)=>{
    const data = await getTotalProductionQty(payload);
    return data;
}

const getTotalProductionQty = async (payload)=>{
    const {unitId} = payload;
    const date = getDate(payload);
    const query = `select count(HWPId) TotalProduction from HourlyWashProductionCount with(nolock) where WashDate = ${date} and UnitId = ${unitId}`;
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

 module.exports = totalProductionServices;