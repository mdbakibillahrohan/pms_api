

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
	    A.CloseDate
    from TenderBidLists A
    inner join Tender B on A.TenderId=B.TenderId
    where B.TenderNo='${TenderNo}'`;
    const data = await getData(dbConfig3, query);
    return data; 
}



module.exports = getPublishTenderDetailsWithIdServices;