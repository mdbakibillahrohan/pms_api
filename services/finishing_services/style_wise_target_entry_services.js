const { getData } = require('../../util/dao');
const { dbConfig } = require('../../util/settings');

const styleWiseTargerEntryServices = async(payload)=>{
    const data = await styleWiseTargetEntry(payload);
    return data;
}


const styleWiseTargetEntry = async(payload)=>{
    const {userInfo, style_id, smv, plant_manpower, hourly_target} = payload;
    const {unitId} = userInfo;
    let query = ``;
}







module.exports = styleWiseTargerEntryServices;