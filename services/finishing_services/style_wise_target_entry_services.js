const { getData, executeQuery } = require('../../util/dao');
const { dbConfig } = require('../../util/settings');

const styleWiseTargerEntryServices = async(payload)=>{
    const isAlreadyExistOrNot = await isAlreadyExist(payload);
    if(!isAlreadyExistOrNot){
        const data = await styleWiseTargetEntry(payload);
        return data;
    }
    return {message: "Already exist"};
}

const styleWiseTargetEntry = async(payload)=>{
    const {styleId, smv, plantManpower, hourlyTarget, unitId} = payload;
    const query = `insert into StyleWiseFinishingTarget(StyleId, SMV, HourlyTarget, PlantManpower, UnitId) 
    values(@StyleId, ${smv}, @HourlyTarget, @PlantManpower, @UnitId);`;
    const params = [
        {
            name: "StyleId",
            value: styleId
        },
        {
            name: "SMV",
            value: smv
        },
        {
            name: "HourlyTarget",
            value: hourlyTarget
        },
        {
            name: "PlantManpower",
            value: plantManpower
        },
        {
            name: "UnitId",
            value: unitId
        },
    ];
    const data = await executeQuery(dbConfig, query, params);
    if(data){
        return {message:"success"};
    }
    return {message:"Error while inserting"};
}

const isAlreadyExist = async(payload)=>{
    const {unitId, styleId} = payload;
    const query = `select count(SWFTId) count from StyleWiseFinishingTarget where StyleId = ${styleId} and UnitId = ${unitId}`;
    const data = await getData(dbConfig, query);
    if(data[0].count>0){
        return true;
    }
    return false;
}





module.exports = styleWiseTargerEntryServices;