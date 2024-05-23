

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
    const {ItemName,ItemId}=payload;
    const query = `select B.ItemId,B.ItemName,isnull(Max(A.BidPrice),0) as BidPrice,A.CreatedAt from BiddingDetails A
    inner join TenderItems B on A.ItemId=B.ItemId
    where B.ItemName like '%${ItemName}%' and B.ItemId=${ItemId}
    and 
    A.BidPrice=ISNULL((
		SELECT Max(BD.BidPrice)
		FROM BiddingDetails BD
		JOIN (
			SELECT TenderUserId, MAX(CreatedAt) AS MaxCreatedAt
			FROM BiddingDetails
			WHERE ItemId = ${ItemId}
			GROUP BY TenderUserId
		) AS MaxDates ON BD.TenderUserId = MaxDates.TenderUserId AND BD.CreatedAt = MaxDates.MaxCreatedAt
		WHERE BD.ItemId = ${ItemId}
	),0)
    group by B.ItemId,B.ItemName,A.CreatedAt`;
    const data = await getData(dbConfig3, query);
    return data; 
}



module.exports = getTenderItemsListsServices;