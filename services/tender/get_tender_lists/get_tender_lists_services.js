

const { 
    getData 
} = require('../../../util/dao');
const { 
    dbConfig3 
} = require('../../../util/settings');

const getTenderListsServices = async (payload)=>{
    let myLists=[];
    const data = await getTenderLists(payload);
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
        A.TenderId,A.TenderNo,A.TenderTitle,A.TenderDescription,A.TotalAmount,
        (
        case when DATEDIFF(second,TBL.OpenDate,GETDATE())>1 and DATEDIFF(second,
		DATEADD(MINUTE,isnull((select sum(K.Minutes) from TimerLogs K where K.TenderBidId=TBL.TenderBidId),0),TBL.CloseDate)
		,GETDATE())<1 and TBL.IsSale=0 then 'On Going'
        when DATEDIFF(second,TBL.OpenDate,GETDATE())<1 and DATEDIFF(second,
		DATEADD(MINUTE,isnull((select sum(K.Minutes) from TimerLogs K where K.TenderBidId=TBL.TenderBidId),0),TBL.CloseDate)
		,GETDATE())<1 and TBL.IsSale=0 then 'Open Soon'
		when DATEDIFF(second,GETDATE(),TBL.OpenDate)<1 and DATEDIFF(second,GETDATE(),
		DATEADD(MINUTE,isnull((select sum(K.Minutes) from TimerLogs K where K.TenderBidId=TBL.TenderBidId),0),TBL.CloseDate))<1 and TBL.IsSale=0 then 'TimeOver'
        else 'Not Publish'
        end
		) as [Status],
		(
        case when DATEDIFF(second,TBL.OpenDate,GETDATE())>1 and DATEDIFF(second,
		DATEADD(MINUTE,isnull((select sum(K.Minutes) from TimerLogs K where K.TenderBidId=TBL.TenderBidId),0),TBL.CloseDate)
		,GETDATE())<1 and TBL.IsSale=0 then 1
        when DATEDIFF(second,TBL.OpenDate,GETDATE())<1 and DATEDIFF(second,
		DATEADD(MINUTE,isnull((select sum(K.Minutes) from TimerLogs K where K.TenderBidId=TBL.TenderBidId),0),TBL.CloseDate)
		,GETDATE())<1 and TBL.IsSale=0 then 2
		when DATEDIFF(second,GETDATE(),TBL.OpenDate)<1 and DATEDIFF(second,GETDATE(),
		DATEADD(MINUTE,ISNULL((SELECT SUM(K.Minutes) FROM TimerLogs K WHERE K.TenderBidId=TBL.TenderBidId),0),
		TBL.CloseDate))<1 and TBL.IsSale=0 then 3
        else 5
        end
		) as Mode,
        (
            Select 
            ROW_NUMBER() OVER (ORDER BY (SELECT 1)) AS [key],
            BB.ItemId,BB.ItemName+' '+ItemRemarks as ItemName,BB.UnitOfMeasurement,BB.ItemQuantity,BB.TargetRate as ItemRate,BB.ItemValue
            from Tender AA 
            inner join TenderItems BB on AA.TenderId=BB.TenderId
            where AA.TenderId=A.TenderId and BB.IsDeleted=0 for json path
        ) as details
        from Tender A
        left join TenderBidLists TBL on A.TenderId=TBL.TenderId
        where A.IsDeleted=0 order by A.TenderId desc OFFSET ${Skip} ROWS 
        FETCH NEXT ${Take} ROWS ONLY  for JSON PATH
    ) as data`;
    const data = await getData(dbConfig3, query);
    return data; 
}

const getCount = async()=>{
    const query = `select Count(TenderId) as count from Tender where IsDeleted=0`;
    const data = await getData(dbConfig3, query);
    return data[0].count;
}


module.exports = getTenderListsServices;