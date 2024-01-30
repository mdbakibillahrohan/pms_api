

const { 
    getData 
} = require('../../../util/dao');
const { 
    dbConfig3 
} = require('../../../util/settings');

const getPublishedTenderListsServices = async (payload)=>{
    const data = await getTenderLists(payload);
    // if(data.length){
    //     myLists=data[0].data
    // }
    //console.log(myLists)
    const count=await getCount(payload);
    return {count:count,lists: data};
}

const getTenderLists = async (payload)=>{
    const {
        UserId,
        Take,
        Skip
    }=payload;
    const query = `select 
    ROW_NUMBER() OVER (ORDER BY (SELECT 1)) AS [key],
       A.TenderBidId,B.TenderNo,B.MinimumBidAmount,A.OpenDate,A.CloseDate,
       (case when A.TenderStatusID=1 and A.IsSale=0 then 'On Going' 
       when A.TenderStatusID=1 and A.IsSale=1 then 'Sold'
       when A.TenderStatusID=0 and A.IsSale=0 then 'On Hold'
       end
       ) as [Status]
   from 
       TenderBidLists A
       inner join Tender B on A.TenderId=B.TenderId
   where A.IsDeleted=0 order by A.TenderBidId desc OFFSET ${Skip} ROWS 
   FETCH NEXT ${Take} ROWS ONLY`;
    const data = await getData(dbConfig3, query);
    return data; 
}

const getCount = async()=>{
    const query = `select Count(TenderBidId) as [count] from TenderBidLists where IsDeleted=0`;
    const data = await getData(dbConfig3, query);
    return data[0].count;
}


module.exports = getPublishedTenderListsServices;