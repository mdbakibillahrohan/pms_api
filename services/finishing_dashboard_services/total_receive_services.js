
const { getData } = require('../../util/dao');
const { dbConfig } = require('../../util/settings');

const totalReceiveService = async (payload)=>{
    const data = await getTotalReceivedGmtQty(payload);
    return {totalReceived: data};
}

const getTotalReceivedGmtQty = async (payload)=>{
    const {unitId} = payload;
    const date = getDate(payload);
    const query = `select count(frd.ChildBarcode) TotalReceived from FinishingReceiveMaster frm with(nolock)
    inner join FinishingReceiveDetails frd with(nolock) on frd.FRMId = frd.FRMId
    inner join UserInfo ui with(nolock) on ui.UserId = frm.CreatedBy
    where frm.ReceivedDate = ${date} and ui.branch_code = ${unitId}`;
    const data = await getData(dbConfig, query);
    return data[0].TotalReceived;
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

module.exports = totalReceiveService;