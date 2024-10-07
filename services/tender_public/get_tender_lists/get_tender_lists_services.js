

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
        Skip,
        UserId
    }=payload;

    if(UserId){
        const query=`exec sp_user_cat_map @action_type='get_all',@tender_user_id1=${UserId};`;

        const data=await getData(dbConfig3,query);

        if(data?.length){
            const lists=data;
            const str=get_cat_id_in_string(lists);

            if(str){
                const query = `with CTE as (select A.TenderId,B.TenderNo,B.TenderTitle,A.OpenDate,
                DATEADD(MINUTE,ISNULL((SELECT SUM(K.Minutes) FROM TimerLogs K WHERE K.TenderBidId=A.TenderBidId),0),A.CloseDate) CloseDate
                ,sum(isnull(C.ItemQuantity,0)) as TotalItems ,
                    isnull(
                        (
                         case when D.BiddingId is null then B.TotalAmount
                         when D.BiddingId is not null then (Select Max(BDN.TotalAmount) from Bidding BDN where BDN.TenderBidId=A.TenderBidId)
                         end
                        )
                    ,0) as HighestBid
                    ,
                    (
                        case when DATEDIFF(second,A.OpenDate,GETDATE())>1 and DATEDIFF(second,DATEADD(MINUTE,ISNULL((SELECT SUM(K.Minutes) FROM TimerLogs K WHERE K.TenderBidId=A.TenderBidId),0),A.CloseDate),GETDATE())<1 then 1
                        when DATEDIFF(second,A.OpenDate,GETDATE())<1 and DATEDIFF(second,DATEADD(MINUTE,ISNULL((SELECT SUM(K.Minutes) FROM TimerLogs K WHERE K.TenderBidId=A.TenderBidId),0),A.CloseDate),GETDATE())<1 then 2
                        else 3
                        end
                    ) as Status,
                    (
                        case when DATEDIFF(second,A.OpenDate,GETDATE())>1 and DATEDIFF(second,DATEADD(MINUTE,ISNULL((SELECT SUM(K.Minutes) FROM TimerLogs K WHERE K.TenderBidId=A.TenderBidId),0),A.CloseDate),GETDATE())<1 then DATEDIFF(second,GETDATE(),DATEADD(MINUTE,ISNULL((SELECT SUM(K.Minutes) FROM TimerLogs K WHERE K.TenderBidId=A.TenderBidId),0),A.CloseDate))
                        when DATEDIFF(second,A.OpenDate,GETDATE())<1 and DATEDIFF(second,DATEADD(MINUTE,ISNULL((SELECT SUM(K.Minutes) FROM TimerLogs K WHERE K.TenderBidId=A.TenderBidId),0),A.CloseDate),GETDATE())<1 then DATEDIFF(second,GETDATE(),A.OpenDate)
                        else '000'
                        end
                    ) as Times,
                    (
                        ISNULL((SELECT SUM(K.Minutes) FROM TimerLogs K WHERE K.TenderBidId=A.TenderBidId),0) 
                    ) as ExtraTimes
                    from TenderBidLists A
                    inner join Tender B on A.TenderId=B.TenderId
                    inner join TenderItems C on B.TenderId=C.TenderId
                    inner join TenderCategory TC on B.CategoryId=TC.TenderCatId
                    left join Bidding D on A.TenderBidId=D.TenderBidId
                    where A.IsDeleted=0  and DATEDIFF(second,DATEADD(MINUTE,ISNULL((SELECT SUM(K.Minutes) FROM TimerLogs K WHERE K.TenderBidId=A.TenderBidId),0),A.CloseDate),GETDATE())<1 and B.CategoryId in(${str})
                    group by B.TenderNo,A.TenderBidId,A.TenderId,B.TenderTitle,B.TotalAmount,A.OpenDate,A.CloseDate,D.BiddingId order by B.TenderNo desc
                    OFFSET  ${Skip} ROWS 
                    FETCH NEXT 2000 ROWS ONLY
                    ) select * INTO #tbl11
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
                        Times,
                        ExtraTimes
                    from #tbl11 group by 
                    TenderNo,TenderTitle,TenderId,OpenDate,CloseDate,HighestBid,Times,Status,TotalItems,ExtraTimes
                    order by Status,Times asc
                    drop table #tbl11`;
                const data = await getData(dbConfig3, query);

                return data;
            }else{
                return [];
            }
        }
    }
    
    return []; 
}

const get_cat_id_in_string=(lists)=>{
    if(lists?.length){
        let new_lists='';
        const len=lists.length;
        lists.map((d,index)=>{
            if((index+1)==len){
                new_lists+=`${d?.value}`;
            }else{
                new_lists+=`${d?.value},`;
            }
        })
        return new_lists;
    }
    return '';
}

module.exports = getTenderListsForUsersServices;