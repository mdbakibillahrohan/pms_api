
const { getData } = require('../../util/dao');
const { dbConfig } = require('../../util/settings');

const totalReceiveService = async (payload)=>{
    const data = await getTotalReceivedGmtQty(payload);
    return data;
}

const getTotalReceivedGmtQty = async (payload)=>{
    const date = getDate(payload);
    const query = `select count(wrd.ChildBarcode) TotalReceived from WashReceiveMaster wrm with(nolock)
    inner join WashReceiveDetails wrd on wrm.WRMId = wrd.WRMId
    inner join UserInfo ui on ui.UserId = wrm.CreatedBy
    where wrm.ReceivedDate = ${date} and ui.branch_code = 75`;
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

 module.exports = totalReceiveService;