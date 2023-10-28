
const { getData } = require('../../util/dao');
const { dbConfig } = require('../../util/settings');

const totalRejectionPercentageServices = async (payload)=>{
    const data = await getRejectionPercentage(payload);
    return data;
}

const getRejectionPercentage = async(payload)=>{
    const totalProduction = await getTotalProductionQty(payload);
    const totalRejection = await getTotalRejectQty(payload);
    const rejectionPercentage =  ((totalRejection[0].TotalReject/totalProduction[0].TotalProduction) * 100).toFixed(2);
    return {rejectionPercentage}; 
}

const getTotalProductionQty = async (payload)=>{
    const {unitId} = payload;
    const date = getDate(payload);
    const query = `select count(HWPId) TotalProduction from HourlyWashProductionCount with(nolock) where WashDate = ${date} and UnitId = ${unitId}`;
    const data = await getData(dbConfig, query);
    return data; 
}

const getTotalRejectQty = async (payload)=>{
    const {unitId} = payload;
    const date = getDate(payload);
    const query = `select COUNT(HWDId) TotalReject from HourlyWashDefectCount with(nolock) 
    where DefectId in (select DefectId from IE_Defects where FaultGroupId=3 and ColumnNo = 3) 
    and WashDate = ${date} and UnitId = ${unitId}`;
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