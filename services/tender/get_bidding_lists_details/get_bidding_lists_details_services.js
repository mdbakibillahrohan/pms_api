

const { 
    getData 
} = require('../../../util/dao');
const { 
    dbConfig3 
} = require('../../../util/settings');

const getBiddingDetailsListsServices = async (payload)=>{
    let myLists=[];
    const data = await getTenderLists(payload);
    //console.log(data)
    if(data.length){
        myLists=data[0].data
    }
    //console.log(myLists)
    const count=await getCount(payload);
    return {count:count,lists: JSON.parse(myLists)};
}

const getTenderLists = async (payload)=>{
    const {
        UserId,
        Take,
        Skip
    }=payload;
    const query = `select(
        select
        ROW_NUMBER() OVER (ORDER BY (SELECT 1)) AS [key],
        A.BiddingId,C.TenderNo,C.TenderNo+' - '+C.TenderTitle as TenderNoTitle,C.TotalAmount as BaseAmount,A.TotalAmount,D.CompanyName,
        (
        select
            ROW_NUMBER() OVER (ORDER BY (SELECT 1)) AS [key],
            AA.BiddingDtlId,CC.ItemName,CC.ItemQuantity,CC.TargetRate as BaseRate,AA.BidPrice
        from BiddingDetails AA
            inner join Bidding BB on AA.BiddingId=BB.BiddingId
            inner join TenderItems CC on AA.ItemId=CC.ItemId
        where BB.BiddingId=A.BiddingId for json path
        ) as details
    from Bidding A
        inner join BiddingDetails B on A.BiddingId=B.BiddingId
        inner join Tender C on A.TenderId=C.TenderId
        inner join TenderUsers D on A.TenderUserId=D.TenderUserId 
    group by A.BiddingId,C.TenderNo,C.TenderTitle,C.TotalAmount,A.TotalAmount,D.CompanyName 
    order by A.BiddingId desc 
    OFFSET ${Skip} ROWS 
    FETCH NEXT ${Take} ROWS ONLY
    for json path
    ) as data`;
    const data = await getData(dbConfig3, query);
    return data; 
}

const getCount = async()=>{
    const query = `select isnull(count(BiddingId),0) [count] from Bidding`;
    const data = await getData(dbConfig3, query);
    return data[0].count;
}


module.exports = getBiddingDetailsListsServices;