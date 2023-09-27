const Joi = require("joi");
const {executeSqlB2}=require('../../util/db');
const chilMenuConfig=require('../../util/childMenuConfig')

const schema=Joi.object().keys({
    UserId: Joi.string().trim().min(3).max(10).required(),
    ModuleId: Joi.string().trim().min(3).max(10).required(),
})

const GetMenuControllerWithModuleId=async(req,res)=>{
    const isValidater=schema.validate(req.query);

    //console.log(req.query)
    if(isValidater){
        let responseLists=[];
        try{
            let {ModuleId,UserId}=req.query;
            if(ModuleId){
                let menuSql=`exec sp_select_menu @desc1=${UserId},@calltype='get_menu_by_user',@desc2=${ModuleId}`;
                const menuData=await executeSqlB2(menuSql);
                const menuDatas=menuData.recordsets[0];

                //let responseLists=[];
                if(menuDatas.length){
                    responseLists=menuDatas.reduce(async(preMenu,mnData)=>{
                    if(!mnData.parentmenu){
                        const subMenus=chilMenuConfig(menuDatas,mnData.MenuId);
                        //console.log(mnData)
                        preMenu=[...await preMenu,{
                        // MenuId:mnData.menuid[0],
                        key:mnData.MenuId,
                        title:mnData.menuname,
                        path:mnData.menupath,
                        SortOrder:mnData.sortorder,
                        ModuleId:mnData.moduleID,
                        menu:{
                            items:subMenus
                        }
                        }]
                    }
                    return preMenu;
                    },[])
                }
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

module.exports.GetMenuControllerWithModuleId=GetMenuControllerWithModuleId;