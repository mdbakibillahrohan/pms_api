const { TABLE } = require("../../util/constant");
const {executeQuery, getData} = require("../../util/dao");
const { dbConfig } = require("../../util/settings");

const challanCheckingServices = async(payload)=>{
    const {is_return} = payload;
    if(is_return){
        const data = await returnChallanChecking(payload);
        if(data){
            return {
                message:"Success"
            }
        }
        return {
            message:"Something went wrong"
        };
    }
    const isAlreadyApprovedOrNotFoundData = await checkIsAlreadyApprovedOrNotFound(payload);
    if(isAlreadyApprovedOrNotFoundData.status){
        return isAlreadyApprovedOrNotFoundData;
    }
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
    }else{
        const finishingChallan = await checkingFinishingChallan(challan_id, UserId);
        if(finishingChallan){
            return true;
        }
    }
}

const checkingWashChallan = async(challan_id, userId)=>{

    /**
     * Updating NewSewingChallan table IsChecking column in db for status
     */
    const updateQuery = `update ${TABLE.NEW_SEWING_CHALLAN} set IsWashChecked = 1 where SCId = ${challan_id}`;
    const update = await executeQuery(dbConfig, updateQuery);
    if(update){
        /**
         * Inserting data into WashChecking Table in db for history
         */
        const query = `insert into ${TABLE.WASH_CHECKING}(SCId, UserId) 
        values(@challan_id, @user_id)`;
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
    return false;
    
}

const checkingFinishingChallan = async(challan_id, userId)=>{
    /**
     * Updating NewWashChallanMaster table IsFinishingChecked column in db for status
     */
    const updateQuery = `update ${TABLE.NEW_WASH_CHALLAN} set IsFinishingChecked = 1 where WCMId = ${challan_id}`;
    const update = await executeQuery(dbConfig, updateQuery);

    if(update){
        /**
         * Inserting data into FinishingChecking Table in db for history
         */
        const query = `insert into ${TABLE.FINISHING_CHECKING}(WCMId, UserId) 
        values(@challan_id, @user_id)`;
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
    return false;
    
}

const checkIsAlreadyApprovedOrNotFound = async(payload)=>{
    const {checking_type, challan_id} = payload;

    //Checking availability
    let availabilityQuery = null;
    if(checking_type==="WashChecking"){
        availabilityQuery = `select count(SCId) count from ${TABLE.NEW_SEWING_CHALLAN} where SCId = ${challan_id}`;
    }else{
        availabilityQuery = `select count(WCMId) count from ${TABLE.NEW_WASH_CHALLAN} where WCMId = ${challan_id}`;
    }
    const availabilityData = await getData(dbConfig, availabilityQuery);
    if(availabilityData[0].count===0){
        return {
            message: "Not found",
            status: true
        }
    }

    //Checking alrady checked or not
    let isAlradyCheckedOrNotQuery = null;
    if(checking_type==="WashChecking"){
        isAlradyCheckedOrNotQuery = `select count(WCId) count from ${TABLE.WASH_CHECKING} where SCId = ${challan_id}`;
    }else{
        isAlradyCheckedOrNotQuery = `select count(FCId) count from ${TABLE.FINISHING_CHECKING} where WCMId = ${challan_id}`;
    }
    const isAlradyCheckedOrNotData = await getData(dbConfig, isAlradyCheckedOrNotQuery);
    if(isAlradyCheckedOrNotData[0].count>0){
        return {
            message: "Already checked",
            status: true
        }
    }else{
        return {
            message: "Success",
            status: false
        }
    }
}

const returnChallanChecking = async(payload)=>{
    const {checking_type, challan_id} = payload;
    const {UserId} = payload.userInfo
    let query = null;
    if(checking_type==="WashChecking"){
        query = `update ReturnWashChallanMaster set CheckedByUserId = ${UserId} where RWCMId = ${challan_id}`;
    }else{
        query = `update ReturnWashChallanMaster set CheckInUserId = ${UserId} where RWCMId = ${challan_id}`;
    }
    const data = await executeQuery(dbConfig, query);
    return data;
}

module.exports = challanCheckingServices;