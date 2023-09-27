const chilMenuConfig=(newArr,parentId)=>{
    let newLists=[];

    if(newArr.length){
        newArr.map((arrData)=>{
            if(arrData.parentmenu==parentId){
                let newObj={
                    MenuPermissionId:arrData.menupermissionid,
                    UserId:arrData.userid,
                    // MenuId:arrData.menuid[0],
                    key:arrData.MenuId,
                    MenuName:arrData.menuname,
                    MenuPath:arrData.menupath,
                    SortOrder:arrData.sororder,
                    ModuleId:arrData.ModuleID
                };

                newLists=[...newLists,newObj];
                //console.log("LL",newLists)
            }
            
        })
    }

    return newLists;
}

module.exports=chilMenuConfig;