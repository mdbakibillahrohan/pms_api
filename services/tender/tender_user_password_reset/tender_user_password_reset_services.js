const { 
    getData, 
    executeQuery,
    executeQueryWithReturnId
} = require('../../../util/dao');

const { 
    dbConfig3 
} = require('../../../util/settings');

const tender_user_password_reset_services = async(payload)=>{
    const data = await updateTender(payload);
    
    if(data){
        return {message:"success"};
    }else{
        return 0;
    }
    
}

const updateTender = async(payload)=>{
    const {
      TenderUserId
    } = payload;


    const query = `update TenderUsers set [Password]='tSEbD4VuMps=' where TenderUserId=${TenderUserId}`;
    const data = await executeQuery(dbConfig3, query, []);

    if(data){
        return 1;
    }
    return {message:"Error while inserting"};
}

module.exports = tender_user_password_reset_services;