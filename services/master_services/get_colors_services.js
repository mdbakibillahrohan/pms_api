

const { getData } = require('../../util/dao');
const { dbConfig } = require('../../util/settings');

const colorServices = async (payload)=>{
    const data = await getColorLists(payload);
    return {colorLists: data};
}

const getColorLists = async (payload)=>{
    let query = `select * from Color`;
    const data = await getData(dbConfig, query);
    return data; 
}

module.exports = colorServices;