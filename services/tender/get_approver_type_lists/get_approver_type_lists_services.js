

const { 
    getData 
} = require('../../../util/dao');
const { 
    dbConfig3 
} = require('../../../util/settings');

const getApproveTypeListsServices = async (payload)=>{
    const data = await getTenderLists(payload);
    //console.log(myLists)
    //const count=await getCount(payload);
    return {lists: data};
}

const getTenderLists = async (payload)=>{
    const query = `select ApprovalTypeId as [key],ApprovalTypeId as [value],TypeName as [label] from ApprovalType where IsActive=1`;
    const data = await getData(dbConfig3, query);
    return data; 
}



module.exports = getApproveTypeListsServices;