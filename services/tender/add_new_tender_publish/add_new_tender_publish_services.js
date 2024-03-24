const { 
    getData, 
    executeQuery,
    executeQueryWithReturnId
} = require('../../../util/dao');

const { 
    dbConfig3 
} = require('../../../util/settings');

const create_new_tender_publish_services = async(payload)=>{
    
    const {TenderBidId}=payload;

    if(TenderBidId===10001){
        const checkDuplicate=await checkDuplicateEntry(payload);

        if(checkDuplicate){
            return {message:"exists"};
        }else{
            const data = await insertNewTenderPublish(payload);
            if(data){
                return {message:"success",data:data};
            }else{
                return 0;
            }
        }
    }else{
        const data = await insertNewTenderPublish(payload);
        if(data){
            return {message:"success",data:data};
        }else{
            return 0;
        }
    }
}

const insertNewTenderPublish = async(payload)=>{
    const {
        TenderBidId,
        TenderId, 
        OpenDate,
        CloseDate,
        CreatedBy
    } = payload;


    let data;
    if(TenderBidId===10001){
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
        data = await executeQuery(dbConfig3, query, params);
    }else{
        const query = `update TenderBidLists set OpenDate='${OpenDate}',CloseDate='${CloseDate}',UpdatedBy=${CreatedBy},UpdatedAt=getDate() where TenderBidId=${TenderBidId}`;
        data = await executeQuery(dbConfig3, query, []);
    }
   
    if(data){
        const TenderData=await getTenderNo(TenderId);
        console.log("TD Data",TenderData)
        return {TenderData};
    }
    return {message:"Error while inserting or updating."};
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

const getTenderNo=async(TenderId)=>{
    if(TenderId){
        const query = `select TenderNo from Tender where TenderId=${TenderId}`;
        const data = await getData(dbConfig3, query);

        if(data){
            return data;
        }else{
            return 0;
        }
    }else{
        return 0;
    }
}

module.exports = create_new_tender_publish_services;