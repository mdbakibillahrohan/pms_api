

const { 
    getData 
} = require('../../../util/dao');
const { 
    dbConfig3 
} = require('../../../util/settings');

const getTenderItemsListsServices = async (payload)=>{
    const data = await getTenderLists(payload);
    //console.log(myLists)
    //const count=await getCount(payload);
    return {lists: data};
}

const getTenderLists = async (payload)=>{
    const query = `select 
    A.ItemId,A.ItemName+' -- '+ISNULL(E.GradeName, 'N/A') as [value] 
    from TenderItems A
	left join TenderGrade E on A.TenderGradeId=E.TenderGradeId
    inner join BiddingDetails B on A.ItemId=B.ItemId  
    inner join Bidding C on B.BiddingId=C.BiddingId
    inner join TenderBidLists D on C.TenderBidId=D.TenderBidId
    where DATEDIFF(second,D.CloseDate,GETDATE())>1
    group by A.ItemId,A.ItemName,E.GradeName
    order by A.ItemId desc`;
    const data = await getData(dbConfig3, query);
    return data; 
}



module.exports = getTenderItemsListsServices;