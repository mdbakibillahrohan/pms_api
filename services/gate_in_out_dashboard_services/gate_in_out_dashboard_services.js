const { getData } = require('../../util/dao');
const { dbConfig } = require('../../util/settings');

const gateInOutDashboardServices = async(payload)=>{
    const checkRequestParameter = checkIsThisRequestValidOrNot(payload);
    if(checkRequestParameter){
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
    //const waitingDataQuery = `select count(SCId) Waiting from NewSewingChallan where Status = 1 and ApprovedByUserId != 0 and ChallanDate = ${date}`;
    const waitingDataQuery = `select count(SCId) Waiting from NewSewingChallan where Status = 1 and ApprovedByUserId != 0`;
    const waitingData = await getData(dbConfig, waitingDataQuery);
    //const passedChallanQuery = `select count(SCId) Passed from NewSewingChallan where status = 1 and CheckedByUserId = ${userInfo.UserId} and ChallanDate = ${date}`;
    const passedChallanQuery = `select count(SCId) Passed from NewSewingChallan where status = 1 and CheckedByUserId = ${userInfo.UserId}`;
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
    let gateInData = null;
    let passedData = null;
    if(gate_in_type==="in"){
        //waitingDataQuery = `select count(SCId) Waiting from NewSewingChallan where Status = 1 and CheckedByUserId != 0 and ChallanDate = ${date}`;
        waitingDataQuery = `select count(SCId) Waiting from NewSewingChallan where Status = 1 and CheckedByUserId != 0`;
        //gateInQuery = `select count(WCId) GateIn from WashChecking Where UserId = ${userInfo.UserId} and CreatedAt = ${date}`;
        gateInQuery = `select count(WCId) GateIn from WashChecking Where UserId = ${userInfo.UserId}`;
        gateInData = await getData(dbConfig, gateInQuery);
    }else{
        //waitingDataQuery = `select count(WCMId) Waiting from NewWashChallanMaster where Status = 1 and ApprovedByUserId != 0 and ChallanDate = ${date}`;
        waitingDataQuery = `select count(WCMId) Waiting from NewWashChallanMaster where Status = 1 and ApprovedByUserId != 0`;
        passedQuery = `select count(WCMId) Passed from NewWashChallanMaster where status = 1 and CheckedByUserId = ${userInfo.UserId}`;
        passedData = await getData(dbConfig, passedQuery);
    }
    const waitingData = await getData(dbConfig, waitingDataQuery);
    
    return{
        waiting: waitingData[0].Waiting,
        gateIn: gateInData?gateInData[0].GateIn:null,
        passed: passedData?passedData[0].Passed:null
    }
}

const getFinishingData = async(payload)=>{
    const {userInfo} = payload;
    const date = getDate(payload);
    //const waitingDataQuery = `select count(WCMId) Waiting from NewWashChallanMaster where Status = 1 and CheckedByUserId != 0 and ChallanDate = ${date}`;
    const waitingDataQuery = `select count(WCMId) Waiting from NewWashChallanMaster where Status = 1 and CheckedByUserId != 0`;
    const waitingData = await getData(dbConfig, waitingDataQuery);
    //const gateInQuery = `select count(FCId) GateIn from FinishingChecking Where UserId = ${userInfo.UserId} and CreatedAt = ${date}`;
    const gateInQuery = `select count(FCId) GateIn from FinishingChecking Where UserId = ${userInfo.UserId}`;
    const gateInData = await getData(dbConfig, gateInQuery);
    return{
        waiting: waitingData[0].Waiting,
        gateIn: gateInData[0].GateIn
    }
}

const getTotalChallanData = async(payload)=>{
    const {challan_type} = payload;
    const date = getDate(payload);
    let totalChallanQuery = null;
    if(challan_type==="sewing"){
        //totalChallanQuery = `select count(SCId) TotalChallan from NewSewingChallan where Status = 1 and ChallanDate = ${date}`
        totalChallanQuery = `select count(SCId) TotalChallan from NewSewingChallan where Status = 1`
    }else{
        //totalChallanQuery = `select count(WCMId) TotalChallan from NewWashChallanMaster where Status = 1 and ChallanDate = ${date}`;
        totalChallanQuery = `select count(WCMId) TotalChallan from NewWashChallanMaster where Status = 1`;
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