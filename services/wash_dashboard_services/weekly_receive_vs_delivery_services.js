const { getData } = require('../../util/dao');
const { dbConfig } = require('../../util/settings');

const weeklyReceiveVsDeliveryServices = async(payload)=>{
    const data = await getWeeklyReceiveVsDeliveryData(payload);
    return data;
}

const getWeeklyReceiveVsDeliveryData = async (payload)=>{
    const date = getDate(payload, true);
    const query = `select nwcm.ChallanDate Date, count(wrd.ChildBarcode) WashReceive, 
    count(distinct nwcd.ChildBarcode) WashChallan from HourlySewingProductionCount hsp with(nolock)
    right join WashReceiveDetails wrd with(nolock) on wrd.ChildBarcode = hsp.ChildBarcode
    right join NewWashChallanDetails nwcd with(nolock) on nwcd.ChildBarcode = hsp.ChildBarcode
    left join NewWashChallanMaster nwcm with(nolock) on nwcm.WCMId = nwcd.WCMId
    left join WashReceiveMaster wrm with(nolock) on wrm.WRMId = wrd.WRMId
    where 1 = 1 
    and nwcm.ChallanDate = wrm.ReceivedDate 
    and nwcm.ChallanDate >= ${date} 
    and wrm.ReceivedDate >= ${date}
    group by nwcm.ChallanDate`;
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

module.exports = weeklyReceiveVsDeliveryServices;