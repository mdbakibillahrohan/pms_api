

const { getData } = require('../../util/dao');
const { dbConfig } = require('../../util/settings');

const buyerServices = async (payload)=>{
    const data = await getBuyerList(payload);
    const count = await getCount(payload);
    return {count, buyerList: data};
}

const getBuyerList = async (payload)=>{
    const query = `select Buyer_id, Buyer_name, ShortName from Reg_Buyer`;
    const data = await getData(dbConfig, query);
    return data; 
}

const getCount = async(payload)=>{
    const query = `select count(Buyer_id) count from Reg_Buyer`;
    const data = await getData(dbConfig, query);
    return data[0].count; 
}

module.exports = buyerServices;