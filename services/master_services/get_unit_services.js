

const { getData } = require('../../util/dao');
const { dbConfig } = require('../../util/settings');

const unitServices = async (payload)=>{
    const data = await getUnitList(payload);
    const count = await getCount(payload);
    return {count, buyerList: data};
}

const getUnitList = async (payload)=>{
    const query = `select UnitId, UnitName, UnitFullName from Unit`;
    const data = await getData(dbConfig, query);
    return data; 
}

const getCount = async(payload)=>{
    const query = `select count(UnitId) count from Unit`;
    const data = await getData(dbConfig, query);
    return data[0].count; 
}

module.exports = unitServices;