

const { 
    getData 
} = require('../../../util/dao');
const { 
    dbConfig3 
} = require('../../../util/settings');

const getTenderDetailsWithUserIdServices = async (payload)=>{
    const data = await getTenderLists(payload);
    //console.log(data)
    if(data.length){
        return {data};
    }else{
        return []
    }
}

const getTenderLists = async (payload)=>{
    const {
        TenderNo,
        UserId,
        ItemLen
    }=payload;
    const query = `select TOP ${ItemLen} A.ItemId,A.BidPrice from BiddingDetails A
    inner join Tender B on A.TenderId=B.TenderId
    where A.TenderUserId=${UserId} and B.TenderNo='${TenderNo}' order by A.CreatedAt desc`;
    const data = await getData(dbConfig3, query);
    return data; 
}

module.exports = getTenderDetailsWithUserIdServices;