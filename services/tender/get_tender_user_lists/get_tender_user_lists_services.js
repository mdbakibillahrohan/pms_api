

const { 
    getData 
} = require('../../../util/dao');
const { 
    dbConfig3 
} = require('../../../util/settings');

const getTenderUserListsServices = async (payload)=>{
    const data = await getTenderLists(payload);
    return {lists:data };
}

const getTenderLists = async (payload)=>{
    const query = `
    select
    TenderUserId as [value],
    TenderUserId as [key],
    CompanyName+' - '+CompanyPhone as [label]
    from TenderUsers where IsApproved=1 order by TenderUserId desc`;
    const data = await getData(dbConfig3, query);
    return data; 
}

module.exports = getTenderUserListsServices;