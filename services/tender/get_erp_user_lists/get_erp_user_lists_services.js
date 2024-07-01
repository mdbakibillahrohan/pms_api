

const { 
    getData 
} = require('../../../util/dao');
const { 
    dbConfig3 
} = require('../../../util/settings');

const getErpUserListsServices = async (payload)=>{
    const data = await getTenderLists(payload);
    //console.log(myLists)
    //const count=await getCount(payload);
    return {lists: data};
}

const getTenderLists = async (payload)=>{
    const query = `select UserId as [key],UserId as [value],FirstName+' '+LastName as [label]
    from Users where IsSuperAdmin=0`;
    const data = await getData(dbConfig3, query);
    return data; 
}



module.exports = getErpUserListsServices;