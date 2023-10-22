const { getData } = require('../../util/dao');
const { dbConfig } = require('../../util/settings');
const getUserPermissionListServices = async(payload)=>{
    const permissionListCount = await getUserPermissionListCount(payload)
    const permissionList = await getUserPermissionList(payload);
    return {
        count: permissionListCount,
        data: permissionList
    };
}

const getUserPermissionList = async(payload)=>{
    const {limit, offset, search_text} = payload;
    const parameters = [];
    let permissionListQuery = `select ui.UserId, ui.UserName, ui.FullName, 
                                cpt.ChallanPermissionType 
                                from ChallanApprovalPermission cap
                                inner join ChallanPermissionType cpt on cpt.CPTId = cap.CPTId
                                inner join UserInfo ui on ui.UserId = cap.UserId
                                where 1 = 1`
    if(search_text){
        permissionListQuery += ` and ui.UserName like @search_text or cpt.ChallanPermissionType like @search_text`
        parameters.push({
            name: "search_text",
            value: `%${search_text}%`
        })
    }
    permissionListQuery += ` order by cap.CreatedAt desc`
    
    if(limit!=undefined && offset!=undefined){
        permissionListQuery += ` offset @offset rows fetch next @limit rows only`;
        parameters.push(
            {
                name: "offset",
                value: offset
            },
            {
                name: "limit",
                value:limit
            }
        )
    }
    const permissionList = await getData(dbConfig, permissionListQuery, parameters);
    return permissionList?permissionList:[];
}

const getUserPermissionListCount = async(payload)=>{
    const { search_text} = payload;
    const parameters = [];
    let permissionListQuery = `select count(cap.CAPId) count 
                                from ChallanApprovalPermission cap
                                inner join ChallanPermissionType cpt on cpt.CPTId = cap.CPTId
                                inner join UserInfo ui on ui.UserId = cap.UserId
                                where 1 = 1`
    if(search_text){
        permissionListQuery += ` and ui.UserName like @search_text or cpt.ChallanPermissionType like @search_text`;
        parameters.push({
            name: "search_text",
            value: `%${search_text}%`
        })
    }
    const permissionList = await getData(dbConfig, permissionListQuery, parameters);
    return permissionList?permissionList[0].count:0;
}

module.exports = getUserPermissionListServices;