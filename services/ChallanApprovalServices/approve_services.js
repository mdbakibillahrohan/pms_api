const {getData} = require('../../util/dao');
const {dbConfig, dbConfig2} = require('../../util/settings');

const approve_services = async(body)=>{
    const userInfoSql = "select * from UserInfo where branch_code = @branch_code";
    const userInfoParameter = [
        {
            name: "branch_code",
            value: 7 
        }
    ];
    const userInfoOfProduction = await getData(dbConfig, userInfoSql, userInfoParameter);
    const menuSql = "select * from Menu where ModuleId = @ModuleId";
    const menuParameter = [
        {
            name: "ModuleId",
            value: 3
        }
    ]
    const all_menu = await getData(dbConfig2, menuSql, menuParameter);
    const data = {
        userInfoOfProduction,
        all_menu
    }
    return data;
}

module.exports = approve_services;