
const { getData } = require('../../util/dao');
const { dbConfig } = require('../../util/settings');

const totalRejectionPercentageServices = async (payload)=>{
    const data = await getRejectionPercentage(payload);
    return data;
}

const getRejectionPercentage = async(payload)=>{
    const totalProduction = await getTotalProductionQty(payload);
    const totalRejection = await getTotalRejectQty(payload);
    let rejectionPercentage =  ((totalRejection[0].TotalReject/totalProduction[0].TotalProduction) * 100).toFixed(2);
    if(rejectionPercentage.includes(NaN)){
        rejectionPercentage = 0;
    }
    return {rejectionPercentage}; 
}

const getTotalProductionQty = async (payload)=>{
    const {unitId} = payload;
    const date = getDate(payload);
    const query = `select count(HFPId) TotalProduction from HourlyFinishingProductionCount with(nolock) where ProductionDate = ${date} and UnitId = ${unitId}`;
    const data = await getData(dbConfig, query);
    return data; 
}

const getTotalRejectQty = async (payload)=>{
    const {unitId} = payload;
    const date = getDate(payload);
    const query = `select count(HFDId) TotalReject from HourlyFinishingDefectCount with (nolock) 
    where DefectId in (51,52) and ProductionDate = ${date} and UnitId = ${unitId}`;
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

 module.exports = totalRejectionPercentageServices;