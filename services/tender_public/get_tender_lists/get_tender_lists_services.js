

const { 
    getData 
} = require('../../../util/dao');
const { 
    dbConfig3 
} = require('../../../util/settings');

const getTenderListsForUsersServices = async (payload)=>{
    const data = await getTenderLists(payload);
    return {lists:data };
}

const getTenderLists = async (payload)=>{
    const {
        Take,
        Skip
    }=payload;
    const query = `with CTE as (select A.TenderId,B.TenderNo,B.TenderTitle,A.OpenDate,A.CloseDate,sum(isnull(C.ItemQuantity,0)) as TotalItems ,
    isnull(
        (
         case when D.BiddingId is null then B.TotalAmount
         when D.BiddingId is not null then (Select Max(BDN.TotalAmount) from Bidding BDN where BDN.TenderBidId=A.TenderBidId)
         end
        )
    ,0) as HighestBid
    ,
    (
        case when DATEDIFF(second,A.OpenDate,GETDATE())>1 and DATEDIFF(second,A.CloseDate,GETDATE())<1 then 1
        when DATEDIFF(second,A.OpenDate,GETDATE())<1 and DATEDIFF(second,A.CloseDate,GETDATE())<1 then 2
        else 3
        end
    ) as Status,
    (
        case when DATEDIFF(second,A.OpenDate,GETDATE())>1 and DATEDIFF(second,A.CloseDate,GETDATE())<1 then DATEDIFF(second,GETDATE(),A.CloseDate)
        when DATEDIFF(second,A.OpenDate,GETDATE())<1 and DATEDIFF(second,A.CloseDate,GETDATE())<1 then DATEDIFF(second,GETDATE(),A.OpenDate)
        else '000'
        end
    ) as Times
    from TenderBidLists A
    inner join Tender B on A.TenderId=B.TenderId
    inner join TenderItems C on B.TenderId=C.TenderId
    left join Bidding D on A.TenderBidId=D.TenderBidId
    where A.IsDeleted=0 and DATEDIFF(second,A.CloseDate,GETDATE())<1
    group by B.TenderNo,A.TenderBidId,A.TenderId,B.TenderTitle,B.TotalAmount,A.OpenDate,A.CloseDate,D.BiddingId order by B.TenderNo desc
    OFFSET  ${Skip} ROWS 
    FETCH NEXT ${Take} ROWS ONLY
    ) select * INTO #tbl1
    FROM CTE order by TenderNo
    
    select 
        TenderId,
        TenderNo,
        TenderTitle,
        TotalItems,
        HighestBid,
        OpenDate,
        CloseDate,
		Status,
        Times
    from #tbl1 group by 
    TenderNo,TenderTitle,TenderId,OpenDate,CloseDate,HighestBid,Times,Status,TotalItems
    order by Status,Times asc
    drop table #tbl1`;
    const data = await getData(dbConfig3, query);
    return data; 
}

module.exports = getTenderListsForUsersServices;