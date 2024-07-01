

const { 
    getData 
} = require('../../../util/dao');
const { 
    dbConfig3 
} = require('../../../util/settings');

const getApproverTypeListsServices = async (payload)=>{
    const data = await getApproverTypeId(payload);
    //console.log(myLists)
    //const count=await getCount(payload);
    return {lists: data};
}

const getApproverTypeId = async (payload)=>{
    const {TypeId}=payload;
    const query = `Select A.UserId,A.UserId as AppUId,A.PrevApprovalId,B.FirstName+' '+B.LastName as [Name],A.IsAudit,A.IsFinalApproval as IsFInal from Approval A
    inner join Users B on A.UserId=B.UserId
    where A.IsActive=1 and A.ApprovalTypeId=${TypeId}`;
    const data = await getData(dbConfig3, query);
    return data; 
}



module.exports = getApproverTypeListsServices;