

const { getData } = require('../../util/dao');
const { dbConfig } = require('../../util/settings');

const getCuttingDetailsWithIdServices = async (payload)=>{
    const data = await getCuttingDetails(payload);
    return {details: data};
}

const getCuttingDetails = async (payload)=>{
    const {id}=payload;
    const query = `Select cd.CuttingDetailsId,cd.CuttingId,c.UnitId,cd.SerialNo as BundleNo,cd.NoPiece as BundleQty,c.StyleId from CuttingDetails cd 
    inner join Cutting c on cd.CuttingId=c.CuttingId
    where cd.CuttingDetailsId=${id}`;
    const data = await getData(dbConfig, query);
    return data; 
}


module.exports = getCuttingDetailsWithIdServices;