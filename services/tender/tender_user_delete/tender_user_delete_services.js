const { 
    getData, 
    executeQuery,
    executeQueryWithReturnId
} = require('../../../util/dao');

const { 
    dbConfig3 
} = require('../../../util/settings');

const delete_tender_user_services = async(payload)=>{
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
      DeletedBy,
    } = payload;

    const query = `update TenderUsers set IsApproved=0,IsDeleted=1,DeletedBy=${DeletedBy},DeletedAt=getDate() where TenderUserId='${TenderUserId}'`;
    const data = await executeQuery(dbConfig3, query, []);

    if(data){
        return 1;
    }
    return {message:"Error while inserting"};
}

module.exports = delete_tender_user_services;