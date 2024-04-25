

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
        UserId
    }=payload;

    const query1=`select isnull(count(A.ItemId),0) as TotalItem from TenderItems A
    inner join Tender B on A.TenderId=B.TenderId
    where B.TenderNo='${TenderNo}'`;

    const countLen = await getData(dbConfig3, query1);

    //console.log(countLen)

    if(countLen.length){
        let len=countLen[0].TotalItem;
        //console.log("Total Item",len)
        const query = `select TOP ${len} A.ItemId,A.BidPrice from BiddingDetails A
        inner join Tender B on A.TenderId=B.TenderId
        where A.TenderUserId=${UserId} and B.TenderNo='${TenderNo}' order by A.CreatedAt desc`;
        const data = await getData(dbConfig3, query);
        return data; 
    }else{
        return [];
    }
}

module.exports = getTenderDetailsWithUserIdServices;