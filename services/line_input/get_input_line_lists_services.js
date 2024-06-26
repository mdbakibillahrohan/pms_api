

const { getData } = require('../../util/dao');
const { dbConfig } = require('../../util/settings');

const getInputLineListsServices = async (payload)=>{
    const data = await getInputLineLists(payload);
    const count=await getCount(payload);
    return {count:count,lists: data};
}

const getInputLineLists = async (payload)=>{
    const {userId,filterDate}=payload;
    const query = `Select cbl.CuttingDetailsId as Id,ln.LocalLineName as LineName,cs.StyleNo,cbl.BundleQty from Cutting_BundleLineInput cbl
    inner join CP_Style cs on cbl.StyleId=cs.Id
    inner join LineNew ln on cbl.LineId=ln.LineId
    where cbl.CreateBy=${userId} and cast(CreateAt as date) = cast('${filterDate}' as date)`;
    const data = await getData(dbConfig, query);
    return data; 
}

const getCount = async(payload)=>{
    const {userId,filterDate}=payload;
    const query = `Select COUNT(cbl.CuttingDetailsId) as count from Cutting_BundleLineInput cbl
    inner join CP_Style cs on cbl.StyleId=cs.Id
    inner join LineNew ln on cbl.LineId=ln.LineId
    where cbl.CreateBy=${userId} and cast(CreateAt as date) = cast('${filterDate}' as date)`;
    const data = await getData(dbConfig, query);
    return data[0].count;
}


module.exports = getInputLineListsServices;