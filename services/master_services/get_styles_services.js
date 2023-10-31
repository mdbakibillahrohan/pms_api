

const { getData } = require('../../util/dao');
const { dbConfig } = require('../../util/settings');

const stylesServices = async (payload)=>{
    const data = await getStylesList(payload);
    const count = await getCount(payload);
    return {count, styleList: data};
}

const getStylesList = async (payload)=>{
    const {buyer_id} = payload;
    let query = `select Id StyleId, StyleNo from CP_Style`;
    if(buyer_id){
        query += `  where Buyer_id = ${buyer_id}`
    }
    const data = await getData(dbConfig, query);
    return data; 
}

const getCount = async(payload)=>{
    const {buyer_id} = payload;
    let query = `select count(Id) count from CP_Style`;
    if(buyer_id){
        query += `  where Buyer_id = ${buyer_id}`
    }
    const data = await getData(dbConfig, query);
    return data[0].count; 
}

module.exports = stylesServices;