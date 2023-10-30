
const { getData } = require('../../util/dao');
const { dbConfig } = require('../../util/settings');

const finishingDaboardWipServices = async (payload)=>{
    const data = await getWipForFinishingDashboard(payload);
    return data;
}

const getWipForFinishingDashboard = async(payload)=>{
    const totalReceived = await getTotalReceivedGmtQty(payload);
    const totalProduction = await getTotalProductionGmtQty(payload);
    const wip = totalReceived[0].TotalReceived - totalProduction[0].TotalProduction;
    return {wip};
}

const getTotalReceivedGmtQty = async (payload)=>{
    const {unitId} = payload;
    const date = getDate(payload);
    const query = `select count(wrd.ChildBarcode) TotalReceived from WashReceiveMaster wrm with(nolock)
    inner join WashReceiveDetails wrd on wrm.WRMId = wrd.WRMId
    inner join UserInfo ui on ui.UserId = wrm.CreatedBy
    where wrm.ReceivedDate = ${date} and ui.branch_code = ${unitId}`;
    const data = await getData(dbConfig, query);
    return data;
}

const getTotalProductionGmtQty = async (payload)=>{
    const {unitId} = payload;
    const date = getDate(payload);
    const query = `select count(HFPId) TotalProduction from HourlyFinishingProductionCount with(nolock) where ProductionDate = ${date} and UnitId = ${unitId}`;
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

 module.exports = finishingDaboardWipServices;