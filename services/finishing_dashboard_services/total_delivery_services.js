
const { getData } = require('../../util/dao');
const { dbConfig } = require('../../util/settings');

const totalDeliveryService = async (payload)=>{
    const data = await getTotalDeliveryGmtQty(payload);
    return data;
}

const getTotalDeliveryGmtQty = async (payload)=>{
    const {unitId} = payload;
    const date = getDate(payload);
    const query = `select isnull(sum(TotalGmtQty), 0) TotalDelivery from NewWashChallanMaster with(nolock) where ChallanDate = ${date} and IsReject = 0
    and FromUnitId = ${unitId}`;
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

 module.exports = totalDeliveryService;