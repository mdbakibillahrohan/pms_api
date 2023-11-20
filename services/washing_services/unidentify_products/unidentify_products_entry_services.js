const { getData, executeQuery } = require('../../../util/dao');
const { dbConfig } = require('../../../util/settings');

const unidentifyProductsEntryServices = async(payload)=>{
    const data = await unidentifyProductsEntry(payload);
    return data;
}

const unidentifyProductsEntry = async(payload)=>{
    const {StyleId, ColorId,Quantity, FromUnitId, Size, ToUnitId,CreatedBy} = payload;
    const query = `insert into UnidentifiedProducts(StyleId,ColorId,Size,Quantity,FromUnitId,ToUnitId,CreatedBy) 
    values(@StyleId,@ColorId,@Size,@Quantity,@FromUnitId,@ToUnitId,@CreatedBy);`;
    const params = [
        {
            name: "StyleId",
            value: StyleId
        },
        {
            name: "ColorId",
            value: ColorId
        },
        {
            name: "Size",
            value: Size
        },
        {
            name: "Quantity",
            value: Quantity
        },
        {
            name: "FromUnitId",
            value: FromUnitId
        },
        {
            name: "ToUnitId",
            value: ToUnitId
        },
        {
            name: "CreatedBy",
            value: CreatedBy
        },
    ];
    const data = await executeQuery(dbConfig, query, params);
    if(data){
        return {message:"success"};
    }
    return {message:"Error while inserting"};
}


module.exports = unidentifyProductsEntryServices;