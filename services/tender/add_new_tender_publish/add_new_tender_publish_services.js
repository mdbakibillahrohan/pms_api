const { 
    getData, 
    executeQuery,
    executeQueryWithReturnId
} = require('../../../util/dao');

const { 
    dbConfig3 
} = require('../../../util/settings');

const create_new_tender_publish_services = async(payload)=>{
    const checkDuplicate=await checkDuplicateEntry(payload);

    if(checkDuplicate){
        return {message:"exists"};
    }else{
        const data = await insertNewTenderPublish(payload);
        if(data){
            return {message:"success"};
        }else{
            return 0;
        }
    }
    
}

const insertNewTenderPublish = async(payload)=>{
    const {
        TenderId, 
        OpenDate,
        CloseDate,
        CreatedBy
    } = payload;


    const query = `insert into TenderBidLists (TenderId,OpenDate,CloseDate,CreatedBy) 
    OUTPUT inserted.TenderBidId
    values(@TenderId,@OpenDate,@CloseDate,@CreatedBy);`;
    const params = [
        {
            name: "TenderId",
            value: TenderId
        },
        {
            name: "OpenDate",
            value: OpenDate
        },
        {
            name: "CloseDate",
            value: CloseDate
        },
        {
            name: "CreatedBy",
            value: CreatedBy
        }
    ];
    const data = await executeQuery(dbConfig3, query, params);
   
    if(data){
        return {data};
    }
    return {message:"Error while inserting"};
}

const checkDuplicateEntry=async(payload)=>{
    const {
        TenderId
    }=payload;

    const query=`select * from 
    TenderBidLists 
    where TenderId=${TenderId}`;

    const data = await getData(dbConfig3, query);

    if(data.length){
        return true;
    }else{
        return false;
    }

}

module.exports = create_new_tender_publish_services;