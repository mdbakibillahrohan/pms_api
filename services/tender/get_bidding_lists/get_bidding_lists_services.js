

const { 
    getData 
} = require('../../../util/dao');
const { 
    dbConfig3 
} = require('../../../util/settings');

const getBiddingListsServices = async (payload)=>{
    let myLists=[];
    const data = await getTenderLists(payload);
    if(data.length){
        myLists=data[0].data
    }
    //console.log(myLists)
    //const count=await getCount(payload);
    return {lists: JSON.parse(myLists)};
}

const getTenderLists = async (payload)=>{
    const {
        UserId,
        Take,
        Skip
    }=payload;
    const query = `select(
        select 	ROW_NUMBER() OVER (ORDER BY (SELECT 1)) AS [key],
            A.TenderBidId,A.TenderId,C.TenderNo,Count(B.BiddingId) as NumberOfBid,Max(B.TotalAmount) as HigestBid,(
            Select 
                ROW_NUMBER() OVER (ORDER BY (SELECT 1)) AS [key],
                BB.BiddingId,CC.CompanyName,BB.TotalAmount from TenderBidLists AA
            inner join Bidding BB on AA.TenderBidId=BB.TenderBidId
            inner join TenderUsers CC on BB.TenderUserId=CC.TenderUserId
            where AA.TenderBidId=A.TenderBidId order by BB.TotalAmount desc  for json path
        ) as details
        from TenderBidLists A
        inner join Bidding B on A.TenderBidId=B.TenderBidId
        inner join Tender C on A.TenderId=C.TenderId group by A.TenderBidId,A.TenderId,C.TenderNo order by A.TenderId desc 
        OFFSET ${Skip} ROWS 
        FETCH NEXT ${Take} ROWS ONLY for json path) as data`;
    const data = await getData(dbConfig3, query);
    return data; 
}

// const getCount = async()=>{
//     const query = `select Count(TenderId) as count from Tender where IsDeleted=0`;
//     const data = await getData(dbConfig3, query);
//     return data[0].count;
// }


module.exports = getBiddingListsServices;