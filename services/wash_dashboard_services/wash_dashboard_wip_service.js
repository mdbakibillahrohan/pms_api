
const { getData } = require('../../util/dao');
const { dbConfig } = require('../../util/settings');

const washDaboardWipServices = async (payload)=>{
    const data = await getWipForWashDashboard(payload);
    return data;
}

const getWipForWashDashboard = async(payload)=>{
    const totalReceived = await getTotalReceivedGmtQty(payload);
    const totalDelivery = await getTotalDeliveryGmtQty(payload);
    const wip = totalReceived[0].TotalReceived - totalDelivery[0].TotalDelivery;
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

 module.exports = washDaboardWipServices;