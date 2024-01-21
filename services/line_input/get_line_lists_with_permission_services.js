

const { getData } = require('../../util/dao');
const { dbConfig } = require('../../util/settings');

const getPermissionLineListsServices = async (payload)=>{
    const data = await getPermissionLineLists(payload);
    return {lists: data};
}

const getPermissionLineLists = async (payload)=>{
    const {UserId}=payload;
    const query = `Select b.LineId,b.LocalLineName as name from UserWiseLinePermission a
    inner join LineNew b on a.LineId=b.LineId
    where UserId=${UserId}`;
    const data = await getData(dbConfig, query);
    return data; 
}


module.exports = getPermissionLineListsServices;