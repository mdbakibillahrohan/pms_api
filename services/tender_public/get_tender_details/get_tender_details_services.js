

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
    const query = `Select A.TenderId,B.TenderNo,B.TenderTitle,
	(
        case when DATEDIFF(second,A.OpenDate,GETDATE())>1 and DATEDIFF(second,A.CloseDate,GETDATE())<1 then 1
        when DATEDIFF(second,A.OpenDate,GETDATE())<1 and DATEDIFF(second,A.CloseDate,GETDATE())<1 then 2
        else 3
        end
    ) as TimeStatus,
    (
        case when DATEDIFF(second,A.OpenDate,GETDATE())>1 and DATEDIFF(second,A.CloseDate,GETDATE())<1 then DATEDIFF(second,GETDATE(),A.CloseDate)
        when DATEDIFF(second,A.OpenDate,GETDATE())<1 and DATEDIFF(second,A.CloseDate,GETDATE())<1 then DATEDIFF(second,GETDATE(),A.OpenDate)
        else '000'
        end
    ) as Times,
    isnull(
    (
        case when D.TotalAmount is null then B.TotalAmount
        when D.TotalAmount is not null then D.TotalAmount
        end
    ),0
    ) as TotalAmounts,
    (
        case when D.TotalAmount is null then (
            Select * from TenderItems TMS where 
            TMS.TenderId=A.TenderId for json path
        )
        when D.TotalAmount is not null  then (
            select TDM.ItemId,TDM.ItemName,TDM.ItemQuantity,BDTL.BidPrice as ItemRate,isnull(TDM.ItemQuantity*BDTL.BidPrice,0) as ItemValue 
            from BiddingDetails BDTL inner join TenderItems TDM on BDTL.ItemId=TDM.ItemId 
            where BDTL.BiddingId=D.BiddingId for json path
        )
        else 'Not Data'
        end
    ) as details 
from TenderBidLists A
    inner join Tender B on A.TenderId=B.TenderId
    left join Bidding D on A.TenderBidId=D.TenderBidId
where B.TenderNo='${TenderNo}' and isnull((
    select Max(BD.TotalAmount) 
    from Bidding BD 
    where BD.TenderId=A.TenderId
),0)=isnull(D.TotalAmount,0)`;
    const data = await getData(dbConfig3, query);
    return data; 
}

module.exports = getTenderDetailsServices;