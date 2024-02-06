

const { 
    getData 
} = require('../../../util/dao');
const { 
    dbConfig3 
} = require('../../../util/settings');

const getGradeListsServices = async (payload)=>{
    const data = await getTenderLists(payload);
    //console.log(myLists)
    //const count=await getCount(payload);
    return {lists: data};
}

const getTenderLists = async (payload)=>{
    const query = `select TenderGradeId as [key],TenderGradeId as [value],GradeName as [label]
    from TenderGrade where IsDeleted=0 order by GradeName asc`;
    const data = await getData(dbConfig3, query);
    return data; 
}



module.exports = getGradeListsServices;