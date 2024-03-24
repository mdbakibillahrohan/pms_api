

const { 
    getData 
} = require('../../../util/dao');
const { 
    dbConfig3 
} = require('../../../util/settings');

const getTenderDetailsServices = async (payload)=>{
    const data = await getTenderLists(payload);
    //console.log(data)
    if(data.length){
        const details=data[0].details
        data[0].details=JSON.parse(details)
        return {lists:data };
    }else{
        return lists=[]
    }
}

const getTenderLists = async (payload)=>{
    const {
        TenderNo
    }=payload;
    const query = `select A.TenderBidId,A.TenderId,B.TenderNo,B.TenderTitle,B.TenderAttachment,
	(
        case when DATEDIFF(second,A.OpenDate,GETDATE())>1 and DATEDIFF(second,DATEADD(MINUTE,ISNULL((SELECT SUM(K.Minutes) FROM TimerLogs K WHERE K.TenderBidId=A.TenderBidId),0),A.CloseDate),GETDATE())<1 then 1
        when DATEDIFF(second,A.OpenDate,GETDATE())<1 and DATEDIFF(second,DATEADD(MINUTE,ISNULL((SELECT SUM(K.Minutes) FROM TimerLogs K WHERE K.TenderBidId=A.TenderBidId),0),A.CloseDate),GETDATE())<1 then 2
        else 3
        end
    ) as TimeStatus,
    (
        case when DATEDIFF(second,A.OpenDate,GETDATE())>1 and DATEDIFF(second,DATEADD(MINUTE,ISNULL((SELECT SUM(K.Minutes) FROM TimerLogs K WHERE K.TenderBidId=A.TenderBidId),0),A.CloseDate),GETDATE())<1 then DATEDIFF(second,GETDATE(),DATEADD(MINUTE,ISNULL((SELECT SUM(K.Minutes) FROM TimerLogs K WHERE K.TenderBidId=A.TenderBidId),0),A.CloseDate))
        when DATEDIFF(second,A.OpenDate,GETDATE())<1 and DATEDIFF(second,DATEADD(MINUTE,ISNULL((SELECT SUM(K.Minutes) FROM TimerLogs K WHERE K.TenderBidId=A.TenderBidId),0),A.CloseDate),GETDATE())<1 then DATEDIFF(second,GETDATE(),A.OpenDate)
        else '000'
        end
    ) as Times,
    (
        ISNULL((SELECT SUM(K.Minutes) FROM TimerLogs K WHERE K.TenderBidId=A.TenderBidId),0) 
    ) as ExtraTimes,
	(
		Select 
			A.ItemId,
			A.ItemName+' '+A.ItemRemarks as ItemName,
			(
				case when TG.TenderGradeId is not null then TG.GradeName
				when TG.TenderGradeId is null then 'N/A'
				else 'N/A'
				end
			) as GradeName,
			A.ItemQuantity,
			isnull(
				(
					case when B.BidPrice is null then A.TargetRate
					when B.BidPrice is not null and B.BidPrice>A.TargetRate then B.BidPrice
					else A.TargetRate
					end
				),0
			) as TargetRate,
			isnull(
				(
					case when B.BidPrice is null then isnull(A.TargetRate*A.ItemQuantity,0)
					when B.BidPrice is not null and B.BidPrice>A.TargetRate then isnull(B.BidPrice*A.ItemQuantity,0)
					else isnull(A.TargetRate*A.ItemQuantity,0)
					end
				),0
			) as ItemValue
	from TenderItems A
		inner join Tender Main on A.TenderId=Main.TenderId
		left join TenderGrade TG on A.TenderGradeId=TG.TenderGradeId
		left join BiddingDetails B on A.ItemId=B.ItemId 
		where Main.TenderNo='${TenderNo}' and isnull((
    select Max(BD.BidPrice) 
    from BiddingDetails BD 
    where BD.ItemId=A.ItemId
	),0)=isnull(B.BidPrice,0)
	Group By A.ItemId,A.ItemName,A.ItemRemarks,A.TargetRate,TG.TenderGradeId,A.TenderGradeId,TG.GradeName,
	A.ItemQuantity,B.BidPrice
		for json path
	) details
from TenderBidLists A
inner join Tender B on A.TenderId=B.TenderId
where B.TenderNo='${TenderNo}'`;
    const data = await getData(dbConfig3, query);
    return data; 
}

module.exports = getTenderDetailsServices;