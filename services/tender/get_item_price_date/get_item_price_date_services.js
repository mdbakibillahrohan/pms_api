

const { 
    getData 
} = require('../../../util/dao');
const { 
    dbConfig3 
} = require('../../../util/settings');

const getTenderItemsListsServices = async (payload)=>{
    const data = await getTenderLists(payload);
    //console.log(myLists)
    //const count=await getCount(payload);
    return {lists: data};
}

const getTenderLists = async (payload)=>{
    const {ItemName,ItemId}=payload;
    const query = `  select B.ItemId,B.ItemName,isnull(Max(A.BidPrice),0) as BidPrice,A.CreatedAt from BiddingDetails A
    inner join TenderItems B on A.ItemId=B.ItemId
    where B.ItemName like '%${ItemName}%' and B.ItemId=${ItemId}
    and 
    A.BidPrice=ISNULL((select max(AA.BidPrice) from BiddingDetails AA inner join TenderItems BB on AA.ItemId=BB.ItemId   where BB.ItemName like '%${ItemName}%' and BB.ItemId=${ItemId}),0)
    group by B.ItemId,B.ItemName,A.CreatedAt`;
    const data = await getData(dbConfig3, query);
    return data; 
}



module.exports = getTenderItemsListsServices;