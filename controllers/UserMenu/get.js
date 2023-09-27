const Joi = require("joi");
const {executeSqlB2}=require('../../util/db');
const chilMenuConfig=require('../../util/childMenuConfig')

const schema=Joi.object().keys({
    UserId: Joi.string().trim().min(3).max(10).required(),
})

const GetMenuController=async(req,res)=>{
    const isValidater=schema.validate(req.query);

    //console.log(req.query)
    if(isValidater){
        let responseLists=[];
        try{
            let {UserId}=req.query;

            let moduleSql=`exec sp_select_module @desc1=${UserId},@desc2='1',@calltype='get_all_module_by_user_permission';`

            const moduleData=await executeSqlB2(moduleSql);
            const moduleLists=moduleData.recordsets[0];

            if(moduleLists.length){
                responseLists=moduleLists.reduce(async(preModule,mData)=>{
                let menuSql=`exec sp_select_menu @desc1=${UserId},@calltype='get_menu_by_user',@desc2=${mData.ModuleID}`;
                const menuData=await executeSqlB2(menuSql);
                const menuDatas=menuData.recordsets[0];

                let menuDtos=[];
                if(menuDatas.length){
                    menuDtos=menuDatas.reduce(async(preMenu,mnData)=>{
                    if(!mnData.parentmenu){
                        const subMenus=chilMenuConfig(menuDatas,mnData.MenuId);
                        //console.log(mnData)
                        preMenu=[...await preMenu,{
                        // MenuId:mnData.menuid[0],
                        MenuId:mnData.MenuId,
                        MenuName:mnData.menuname,
                        MenuPath:mnData.menupath,
                        SortOrder:mnData.sortorder,
                        ModuleId:mnData.moduleID,
                        children:subMenus
                        }]
                    }
                    return preMenu;
                    },[])
                }
                return[
                    ...await preModule,
                    {
                    ModuleID: mData.ModuleID,
                    MenuName: mData.ModuleName,
                    IconName: mData.IconName,
                    IconColor: mData.IconColor,
                    SortOrder: mData.SortOrder,
                    children:await menuDtos
                    },
                ]
                },[])
            } 
            
            return res.status(200).json({
                IsSuccess:true,
                MenuLists:await responseLists
            })
        }catch{
            return res.status(500).json({message:'Internal Server Error!'})
        }
    }else{
        return res.status(500).json({message:'Internal Server Error!'})
    }
}

module.exports.GetMenuController=GetMenuController;