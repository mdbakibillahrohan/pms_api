const { getData } = require('../../util/dao');
const { dbConfig } = require('../../util/settings');

const gateInOutDashboardServices = async(payload)=>{
    const checkRquestParameter = checkIsThisRequestValidOrNot(payload);
    if(checkRquestParameter){
        const data = await getGateInOutDashboardData(payload);
        return {message: "success", data};
    }
    return {message:"Request invalid"};
}

const checkIsThisRequestValidOrNot = (payload)=>{
    const {gate_in_type, challan_type} = payload;
    if(challan_type==="wash"){
        return true;
    }else if(challan_type==="sewing"){
        if(gate_in_type==="in"){
            return false;
        }
        return true;
    }else if(challan_type==="finishing"){
        if(gate_in_type==="out"){
            return false;
        }
        return true;
    }
    return false;
}

const getGateInOutDashboardData = async(payload)=>{
    const {challan_type} = payload;
    let data = {};
    const total = await getTotalChallanData(payload);
    if(challan_type==="sewing"){
        data = await getSewingData(payload);
    }else if(challan_type==="wash"){
        data = await getWashData(payload);
    }else{
        data = await getFinishingData(payload);
    }
    const returnData = {...data, total};
    return returnData;
}

const getSewingData = async(payload)=>{
    const {userInfo} = payload;
    const date = getDate(payload);
    const waitingDataQuery = `select count(SCId) Waiting from NewSewingChallan where Status = 1 and ApprovedByUserId != 0 and ChallanDate = ${date}`;
    const waitingData = await getData(dbConfig, waitingDataQuery);
    const passedChallanQuery = `select count(SCId) Passed from NewSewingChallan where status = 1 and CheckedByUserId = ${userInfo.UserId} and ChallanDate = ${date}`;
    const passedChallanData = await getData(dbConfig, passedChallanQuery);

    return{
        waiting: waitingData[0].Waiting,
        passed: passedChallanData[0].Passed
    }
}

const getWashData = async(payload)=>{
    const {userInfo, gate_in_type} = payload;
    const date = getDate(payload);
    let waitingDataQuery = null;
    let gateInQuery = null;
    let passedQuery = null;
    if(gate_in_type==="in"){
        waitingDataQuery = `select count(SCId) Waiting from NewSewingChallan where Status = 1 and CheckedByUserId != 0 and ChallanDate = ${date}`;
        gateInQuery = ``
    }else{

    }
}

const getFinishingData = async(payload)=>{

}

const getTotalChallanData = async(payload)=>{
    const {challan_type} = payload;
    const date = getDate(payload);
    let totalChallanQuery = null;
    if(challan_type==="sewing"){
        totalChallanQuery = `select count(SCId) TotalChallan from NewSewingChallan where Status = 1 and ChallanDate = ${date}`
    }else{
        totalChallanQuery = `select count(WCMId) TotalChallan from NewWashChallanMaster where Status = 1 and ChallanDate = ${date}`;
    }
    const totalChallanData = await getData(dbConfig, totalChallanQuery);
    return totalChallanData[0].TotalChallan;
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

module.exports = gateInOutDashboardServices;