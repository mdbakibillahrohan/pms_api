const { TABLE } = require('../../util/constant');
const {getData, executeQuery} = require('../../util/dao');
const {dbConfig} = require('../../util/settings');

const challanApproveServices = async(payload)=>{
    const {challan_type, challan_id, approver_stack, next} = payload;
    let sendData = {};
    const data = {
        ChallanType: challan_type,
        ChallanId: challan_id,
        ApproverStack: approver_stack,
        For: next
    };
    if(next==="RDC"){
        data.Next = "ApprovedBy";
    }else if(next==="ApprovedBy"){
        data.Next = "CheckedBy"
    }

    const isAlreadyApproved = await checkIfAlreadyApprovedOrNot(payload);
    if(isAlreadyApproved){
       sendData.message = "Already approved";
       sendData.data = data;
       return sendData;
    }

    if(challan_type==='sewing'){
        const data = await approveSewingChallan(payload);
        if(data){
            sendData.message = "Success";
        }else{
            sendData.message = "Something went wrong";
        }
    }else{
        const data = await approveWashChallan(payload);
        if(data){
            sendData.message = "Success";
        }else{
            sendData.message = "Something went wrong";
        }
    }
    sendData.data = data;
    return sendData;
}

const checkIfAlreadyApprovedOrNot = async(payload)=>{
    const {challan_id, approver_stack, challan_type, approver_id} = payload;
    let query = null;
    let partialQuery = null;

    if(challan_type=='sewing'){
        switch(approver_stack){
            case "RDC":
                partialQuery = `RDCUserId = ${approver_id}`;
                break;
            case "ApprovedBy":
                partialQuery = `ApprovedByUserId = ${approver_id}`;
                break;
            case "CheckedBy":
                partialQuery = `CheckedByUserId = ${approver_id}`;
                break;
        }
        query = `select count(SCId) count from ${TABLE.NEW_SEWING_CHALLAN} where ${partialQuery} and SCId = ${challan_id}`;
    }else{
        switch(approver_stack){
            case "RDC":
                partialQuery = `RDCUserId = ${approver_id}`;
                break;
            case "ApprovedBy":
                partialQuery = `ApprovedByUserId = ${approver_id}`;
                break;
            case "CheckedBy":
                partialQuery = `CheckedByUserId = ${approver_id}`;
                break;
        }
        query = `select count(WCMId) count from ${TABLE.NEW_WASH_CHALLAN} where ${partialQuery} and WCMId = ${challan_id}`;
    }
    const data = await getData(dbConfig, query);
    return data[0].count>0;
}

const approveSewingChallan = async(payload)=>{
    const {approver_id, approver_stack, challan_id} = payload;
    let partialQuery = null;

    switch(approver_stack){
        case "RDC":
            partialQuery = `RDCUserId = ${approver_id}`;
            break;
        case "ApprovedBy":
            partialQuery = `ApprovedByUserId = ${approver_id}`;
            break;
        case "CheckedBy":
            partialQuery = `CheckedByUserId = ${approver_id}`;
            break;
    }

    const query = `update ${TABLE.NEW_SEWING_CHALLAN} set ${partialQuery}  where SCId = ${challan_id}`;
    const data = await executeQuery(dbConfig, query);
    
    return data;  
}

const approveWashChallan = async(payload)=>{
    const {approver_id, approver_stack, challan_id} = payload;
    let partialQuery = null;

    switch(approver_stack){
        case "RDC":
            partialQuery = `RDCUserId = ${approver_id}`;
            break;
        case "ApprovedBy":
            partialQuery = `ApprovedByUserId = ${approver_id}`;
            break;
        case "CheckedBy":
            partialQuery = `CheckedByUserId = ${approver_id}`;
            break;
    }

    const query = `update ${TABLE.NEW_WASH_CHALLAN} set ${partialQuery}  where WCMId = ${challan_id}`;
    const data = await executeQuery(dbConfig, query);
    return data;
}

module.exports = challanApproveServices;