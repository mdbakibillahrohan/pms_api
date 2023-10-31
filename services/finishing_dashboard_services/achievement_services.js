
const { getData } = require('../../util/dao');
const { dbConfig } = require('../../util/settings');

const achievementServices = async (payload)=>{
    const data = await getAchievementData(payload);
    return data;
}

const getAchievementData = async (payload)=>{
    const totalTarget = await getTotalTarget(payload);
    const production = await getTotalProduction(payload);
    const achievement = (production/totalTarget)*100;
    return {achievement: achievement?achievement:0};
}

const getTotalTarget = async(payload)=>{
    const {unitId} = payload;
    const date = getDate(payload);
    const query = `select top 1 (HourlyTarget*8) Target from StyleWiseFinishingTarget where UnitId = ${unitId} 
    and StyleId = (select top 1 StyleId from HourlyFinishingProductionCount where ProductionDate = ${date} and UnitId = ${unitId} order by CreateAt desc)`;
    const data = await getData(dbConfig, query);
    return data[0]?data[0].Target:0;
}

const getTotalProduction = async(payload)=>{
    const {unitId} = payload;
    const date = getDate(payload);
    const query = `select count(ChildBarcode) Production from HourlyFinishingProductionCount where ProductionDate = ${date} and UnitId = ${unitId}`;
    const data = await getData(dbConfig, query);
    return data[0]?data[0].Production:0;
}

const getDate = (payload, isWeekly = false)=>{
    if(isWeekly){
        return "CAST(DATEADD(day,-7, GETDATE()) as date)";
    }
    const {date} = payload;
    if(date){
        return `'${date}'`;
    }
    return "CAST(GETDATE() as date)";
}

module.exports = achievementServices;