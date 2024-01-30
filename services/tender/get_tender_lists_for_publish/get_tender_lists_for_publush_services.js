

const { 
    getData 
} = require('../../../util/dao');
const { 
    dbConfig3 
} = require('../../../util/settings');

const getTenderListsServices = async (payload)=>{
    const data = await getTenderLists(payload);
    return {lists:data };
}

const getTenderLists = async (payload)=>{
    // const {
    //     UserId,
    //     Take,
    //     Skip
    // }=payload;
    const query = `select 
    A.TenderId as [key],A.TenderId as [value],TenderNo+'  -  '+TenderTitle as [label]
from 
    Tender A
    left join TenderBidLists B on A.TenderId=B.TenderId
where A.IsDeleted=0 AND B.TenderId is null
order by A.TenderId desc`;
    const data = await getData(dbConfig3, query);
    return data; 
}

module.exports = getTenderListsServices;