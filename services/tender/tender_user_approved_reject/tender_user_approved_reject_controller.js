const { 
    getData, 
    executeQuery,
    executeQueryWithReturnId
} = require('../../../util/dao');

const { 
    dbConfig3 
} = require('../../../util/settings');

const update_tender_user_services = async(payload)=>{
    const data = await updateTender(payload);
    
    if(data){
        return {message:"success"};
    }else{
        return 0;
    }
    
}

const updateTender = async(payload)=>{
    const {
      TenderUserId,
      ApprovedBy,
      Status
    } = payload;

    const query = `update TenderUsers set IsDeleted=0,IsApproved=${Status==0?1:0},ApprovedBy=${ApprovedBy},ApprovedAt=getDate() where TenderUserId='${TenderUserId}'`;
    const data = await executeQuery(dbConfig3, query, []);

    if(data){
        return 1;
    }
    return {message:"Error while inserting"};
}

module.exports = update_tender_user_services;