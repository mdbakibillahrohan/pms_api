

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
            A.TenderBidId,A.TenderId,C.TenderNo,C.TenderNo+' - '+C.TenderTitle as TenderNoTitle,Count(B.BiddingId) as NumberOfBid,Max(B.TotalAmount) as HigestBid,
			 (
        case when DATEDIFF(second,A.OpenDate,GETDATE())>1 and DATEDIFF(second,
		DATEADD(MINUTE,isnull((select sum(K.Minutes) from TimerLogs K where K.TenderBidId=A.TenderBidId),0),A.CloseDate)
		,GETDATE())<1 and A.IsSale=0 then 'On Going'
        when DATEDIFF(second,A.OpenDate,GETDATE())<1 and DATEDIFF(second,
		DATEADD(MINUTE,isnull((select sum(K.Minutes) from TimerLogs K where K.TenderBidId=A.TenderBidId),0),A.CloseDate)
		,GETDATE())<1 and A.IsSale=0 then 'Open Soon'
		when DATEDIFF(second,GETDATE(),A.OpenDate)<1 and DATEDIFF(second,GETDATE(),
		DATEADD(MINUTE,isnull((select sum(K.Minutes) from TimerLogs K where K.TenderBidId=A.TenderBidId),0),A.CloseDate))<1 and A.IsSale=0 then 'TimeOver'
        else 'Not Publish'
        end
		) as [Status],
			(
				case when DATEDIFF(second,A.OpenDate,GETDATE())>1 and DATEDIFF(second,DATEADD(MINUTE,ISNULL((SELECT SUM(K.Minutes) FROM TimerLogs K WHERE K.TenderBidId=A.TenderBidId),0),A.CloseDate),GETDATE())<1 then 1
				when DATEDIFF(second,A.OpenDate,GETDATE())<1 and DATEDIFF(second,
				DATEADD(MINUTE,ISNULL((SELECT SUM(K.Minutes) FROM TimerLogs K WHERE K.TenderBidId=A.TenderBidId),0),A.CloseDate)
				,GETDATE())<1 then 2
				else 3
				end
			) as TimeStatus,
			(
            Select 
                ROW_NUMBER() OVER (ORDER BY (SELECT 1)) AS [key],
                BB.BiddingId,CC.CompanyName,BB.TotalAmount from TenderBidLists AA
            inner join Bidding BB on AA.TenderBidId=BB.TenderBidId
            inner join TenderUsers CC on BB.TenderUserId=CC.TenderUserId
            where AA.TenderBidId=A.TenderBidId order by BB.TotalAmount desc  for json path
        ) as details
        from TenderBidLists A
        inner join Bidding B on A.TenderBidId=B.TenderBidId
        inner join Tender C on A.TenderId=C.TenderId group by A.TenderBidId,A.OpenDate,A.CloseDate,A.IsSale,A.TenderId,C.TenderNo,C.TenderTitle order by A.TenderId desc 
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