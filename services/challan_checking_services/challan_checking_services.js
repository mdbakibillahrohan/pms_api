const { TABLE } = require("../../util/constant");
const {executeQuery} = require("../../util/dao");
const { dbConfig } = require("../../util/settings");

const challanCheckingServices = async(payload)=>{
    const challanCheckingData = await challanChecking(payload);
    if(challanCheckingData){
        return {
            message:"Success"
        }
    };
    return {
        message:"Something went wrong"
    };
}

const challanChecking = async(payload)=>{
    const {checking_type, challan_id, userInfo} = payload;
    const {UserId} = userInfo;
    if(checking_type==="WashChecking"){
        const washChallan = await checkingWashChallan(challan_id, UserId);
        if(washChallan){
            return true;
        }
    }else if(checking_type==="FinishingChecking"){
        const finishingChallan = await checkingFinishingChallan(challan_id, UserId);
        if(finishingChallan){
            return true;
        }
    }
}

const checkingWashChallan = async(challan_id, userId)=>{
    const query = `insert into ${TABLE.WASH_CHECKING}(SCId, UserId) 
    values(@challan_id, @user_id);`;
    const params = [
        {
            name:"challan_id",
            value: challan_id
        },
        {
            name:"user_id",
            value: userId
        },
    ];
    const executed = await executeQuery(dbConfig, query, params);
    return executed;
}

const checkingFinishingChallan = async(challan_id, userId)=>{
    const query = `insert into ${TABLE.FINISHING_CHECKING}(WCMId, UserId) 
    values(@challan_id, @user_id);`;
    const params = [
        {
            name:"challan_id",
            value: challan_id
        },
        {
            name:"user_id",
            value: userId
        },
    ];
    const executed = await executeQuery(dbConfig, query, params);
    return executed;
}

module.exports = challanCheckingServices;