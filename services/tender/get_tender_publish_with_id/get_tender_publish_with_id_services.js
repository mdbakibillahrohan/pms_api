

const { 
    getData 
} = require('../../../util/dao');
const { 
    dbConfig3 
} = require('../../../util/settings');

const getPublishTenderDetailsWithIdServices = async (payload)=>{
    const data = await getTenderLists(payload);
    return data;
}

const getTenderLists = async (payload)=>{
    const {
        TenderNo
    }=payload;
    const query = `select
	    A.TenderBidId,
	    B.TenderId as TenderId,
	    B.TenderNo+' - '+B.TenderTitle as TenderTitle,
	    A.OpenDate,
	    A.CloseDate,
		( 
			select B2.TenderUserId as [value],B2.TenderUserId as [key],B2.CompanyName+'--'+B2.CompanyPhone as [name] from TenderUserMap A2
			inner join TenderUsers B2 on A2.TenderUserId=B2.TenderUserId
			where A2.TenderBidId=A.TenderBidId  and A2.IsActive=1 FOR JSON PATH
		) as users
    from TenderBidLists A
    inner join Tender B on A.TenderId=B.TenderId
	
    where B.TenderNo='${TenderNo}'`;
    const data = await getData(dbConfig3, query);
    return data; 
}



module.exports = getPublishTenderDetailsWithIdServices;