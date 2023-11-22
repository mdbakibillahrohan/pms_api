const { getData } = require('../../../util/dao');
const { dbConfig } = require('../../../util/settings');

const unidentifyProductListServices = async(payload)=>{
    const data = await getUnidentifyProductList(payload);
    const count = await getUnidentifyProductCount(payload);
    return {count,unidentifyProductLists:data};
}

const getUnidentifyProductList = async (payload)=>{
    //const {searchText, limit, offset} = payload;
    const params = [];
    let query = `Select UP.Id,CS.StyleNo,C.ColorName,U.UnitName,UP.Size,UP.Quantity from UnidentifiedProducts UP
    inner join CP_Style CS on UP.StyleId=CS.Id
    inner join Color C on UP.ColorId=C.ColorId
    inner join Unit U on UP.ToUnitId=U.UnitId
    order by UP.CreatedAt desc`;

    // if(searchText){
    //     query += ` and StyleNo like @searchText or u.UnitName like @searchText`;
    //     params.push( {
    //         name: "searchText",
    //         value: searchText
    //     })
    // }
    // if(offset && limit){
    //     query += ` order by swft.SWFTId desc
    //     OFFSET @offset Rows FETCH next @limit rows ONLY`;
    //     params.push({
    //         name: "offset",
    //         value: offset
    //     })
    //     params.push({
    //         name: "limit",
    //         value: limit
    //     })
    // }
    const data = await getData(dbConfig, query, params);
    return data;
} 

const getUnidentifyProductCount =  async(payload)=>{
    //const {searchText} = payload;
    const params = [];
    let query = `Select COUNT(UP.Id) count from UnidentifiedProducts UP
    inner join CP_Style CS on UP.StyleId=CS.Id
    inner join Color C on UP.ColorId=C.ColorId
    inner join Unit U on UP.ToUnitId=U.UnitId`;

    // if(searchText){
    //     query += ` and StyleNo like @searchText or u.UnitName like @searchText`;
    //     params.push( {
    //         name: "searchText",
    //         value: searchText
    //     })
    // }
    const data = await getData(dbConfig, query, params);
    return data[0].count;
}

module.exports = unidentifyProductListServices;