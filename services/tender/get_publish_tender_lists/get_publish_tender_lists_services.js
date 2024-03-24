

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
       A.TenderBidId,B.TenderNo,B.TenderNo+' - '+B.TenderTitle as TenderNoTitle,B.MinimumBidAmount,A.OpenDate,
	   DATEADD(MINUTE,ISNULL((SELECT SUM(K.Minutes) FROM TimerLogs K WHERE K.TenderBidId=A.TenderBidId),0),A.CloseDate) CloseDate,
	   (
        case when DATEDIFF(second,A.OpenDate,GETDATE())>1 and DATEDIFF(second,DATEADD(MINUTE,ISNULL((SELECT SUM(K.Minutes) FROM TimerLogs K WHERE K.TenderBidId=A.TenderBidId),0),A.CloseDate),GETDATE())<1 and A.IsSale=0 then 'On Going'
        when DATEDIFF(second,A.OpenDate,GETDATE())<1 and DATEDIFF(second,DATEADD(MINUTE,ISNULL((SELECT SUM(K.Minutes) FROM TimerLogs K WHERE K.TenderBidId=A.TenderBidId),0),A.CloseDate),GETDATE())<1 and A.IsSale=0 then 'Open Soon'
		when DATEDIFF(second,GETDATE(),A.OpenDate)<1 and DATEDIFF(second,GETDATE(),DATEADD(MINUTE,ISNULL((SELECT SUM(K.Minutes) FROM TimerLogs K WHERE K.TenderBidId=A.TenderBidId),0),A.CloseDate))<1 and A.IsSale=1 then 'Sold'
        else 'Time Over'
        end
		) as [Status]
    from 
       TenderBidLists A
       inner join Tender B on A.TenderId=B.TenderId
    where 
    A.IsDeleted=0 
    group by A.TenderBidId,B.TenderNo,B.TenderTitle,B.MinimumBidAmount,A.OpenDate,A.CloseDate,A.IsSale
    order by A.TenderBidId desc OFFSET ${Skip} ROWS 
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