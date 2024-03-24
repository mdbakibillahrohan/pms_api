const { 
    getData, 
    executeQuery,
    executeQueryWithReturnId
} = require('../../../util/dao');

const { 
    dbConfig3 
} = require('../../../util/settings');

const create_new_bidding_services = async(payload)=>{
    const data = await insertNewBidding(payload);
    //console.log("Data",data)
    if(data){
        return {message:"success"};
    }else{
        return 0;
    }
    
}

const insertNewBidding = async(payload)=>{
    const {
        TenderUserId,
        AttachmentId,
        AttachmentUrl
    } = payload;
    //console.log('paylofd: ',payload)

    const query = `insert into TenderUserAttachment (TenderUserId,AttachmentId,AttachmentUrl) 
    OUTPUT inserted.TenderUserAttachmentId
    values(@TenderUserId,@AttachmentId,@AttachmentUrl);`;
    const params = [
        {
            name: "TenderUserId",
            value: TenderUserId
        },
        {
            name: "AttachmentId",
            value: AttachmentId
        },
        {
            name: "AttachmentUrl",
            value: AttachmentUrl
        }
    ];
    const data = await executeQueryWithReturnId(dbConfig3, query, params);
    //console.log("|Data: ",data)
   
    if(data){
        return {data};
    }
    return {message:"Error while inserting"};
}
module.exports = create_new_bidding_services;