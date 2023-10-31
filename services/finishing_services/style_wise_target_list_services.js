const { getData } = require('../../util/dao');
const { dbConfig } = require('../../util/settings');

const styleWiseTargetListServices = async(payload)=>{
    const data = await getStyleWiseTargetList(payload);
    const count = await getStyleWiseTargetCount(payload);
    return {count,styleWiseTargetList:data};
}

const getStyleWiseTargetList = async (payload)=>{
    const {searchText, limit, offset} = payload;
    const params = [];
    let query = `select swft.SWFTId, cs.StyleNo, swft.SMV, swft.HourlyTarget, swft.PlantManpower, 
    u.UnitName from StyleWiseFinishingTarget swft 
    inner join CP_Style cs on cs.Id = swft.StyleId
    inner join Unit u on u.UnitId = swft.UnitId where 1 = 1`;

    if(searchText){
        query += ` and StyleNo like @searchText or u.UnitName like @searchText`;
        params.push( {
            name: "searchText",
            value: searchText
        })
    }
    if(offset && limit){
        query += ` order by swft.SWFTId desc
        OFFSET @offset Rows FETCH next @limit rows ONLY`;
        params.push({
            name: "offset",
            value: offset
        })
        params.push({
            name: "limit",
            value: limit
        })
    }
    const data = await getData(dbConfig, query, params);
    return data;
} 

const getStyleWiseTargetCount =  async(payload)=>{
    const {searchText} = payload;
    const params = [];
    let query = `select count(swft.SWFTId) count from StyleWiseFinishingTarget swft 
    inner join CP_Style cs on cs.Id = swft.StyleId
    inner join Unit u on u.UnitId = swft.UnitId where 1 = 1`;

    if(searchText){
        query += ` and StyleNo like @searchText or u.UnitName like @searchText`;
        params.push( {
            name: "searchText",
            value: searchText
        })
    }
    const data = await getData(dbConfig, query, params);
    return data[0].count;
}

module.exports = styleWiseTargetListServices;