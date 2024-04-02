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

    let partialQuery='';

    if(Status==1){
        partialQuery=`,IsRejected=1,RejectedBy=${ApprovedBy},RejectedAt=getDate()`;
    }else if(Status==0){
        partialQuery=`,IsApproved=1,ApprovedBy=${ApprovedBy},ApprovedAt=getDate()`;
    }

    const query = `update TenderUsers set IsDeleted=0 ${partialQuery} where TenderUserId='${TenderUserId}'`;
    const data = await executeQuery(dbConfig3, query, []);

    if(data){
        return 1;
    }
    return {message:"Error while inserting"};
}

module.exports = update_tender_user_services;