
const { getData } = require('../../util/dao');
const { dbConfig } = require('../../util/settings');

const thisMonthTotalProductionServices = async (payload)=>{
    const data = await getThisMonthTotalProductionQty(payload);
    return data;
}

const getThisMonthTotalProductionQty = async (payload)=>{
    const {unitId} = payload;
    const date = getDate(payload, true);
    const query = `select count(HFPId) TotalProduction from HourlyFinishingProductionCount with(nolock) where ProductionDate >= ${date} and UnitId = ${unitId}`;
    const data = await getData(dbConfig, query);
    return data; 
}

const getDate = (payload, monthly = false)=>{
    const today = new Date();
    if(monthly){
        return `CAST(DATEADD(day,-${today.getDate()}, GETDATE()) as date)`;
    }
    const {date} = payload;
    if(date){
        return `'${date}'`;
    }
    return "CAST(GETDATE() as date)";
}

 module.exports = thisMonthTotalProductionServices;