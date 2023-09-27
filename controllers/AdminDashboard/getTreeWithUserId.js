const Joi = require("joi");
const {executeSqlB}=require('../../util/db');


const schema=Joi.object().keys({
    UserId: Joi.string().trim().min(3).max(10).required(),
    UserLevelId: Joi.string().trim().min(3).max(10).required(),
})

const GetTreeWithUserIdController=async(req,res)=>{
    const isValidater=schema.validate(req.query);

    //console.log(req.query)
    if(isValidater){
        const {UserId,UserLevelId}=req.query;
        
        let cQueryOne=`exec sp_Select_Employee @desc1=${UserId},@desc2=${UserLevelId},@calltype='Get_Employee_For_Tree_Company'`;



        try{
            const companyData=await executeSqlB(cQueryOne);

            const companyDatas=companyData.recordsets[0];
            //console.log("Company : ",companyDatas)
            if(companyDatas.length){
                let response=companyDatas.reduce(async(preCompany,cData)=>{

                let unitSql=`exec sp_Select_Employee @desc1=${cData.id},@desc2=${UserId},@desc3=${UserLevelId},@calltype='Get_Employee_For_Tree_Unit'`;
            
            
                const unitData=await executeSqlB(unitSql);
                const unitDatas=unitData.recordsets[0];

                let unitDts=[]
                if(unitDatas.length){
                    unitDts=unitDatas.reduce(async(preUnit,uData)=>{
                    let departmentSql=`exec sp_Select_Employee @desc1=${uData.id},@desc2=${UserId},@desc3=${UserLevelId},@calltype='Get_Employee_For_Tree_Department'`;

                    const departmentData=await executeSqlB(departmentSql);
                    const departmentDatas=departmentData.recordsets[0];

                    let departmentDtos=[];

                    if(departmentDatas.length){
                        departmentDtos=departmentDatas.reduce(async(preDepartment,dData)=>{
                        let sectionSql=`if exists(select * from UserSectionPermission where UserId=${UserId})--permission wise
                        begin
                            select distinct b.SectionID id,SectionName [text],'Sec' AS Tag
                            from UserSectionPermission a
                            left join [Common_Section] b on a.SectionId=b.SectionID 
                            inner join R_DeptSection ds on ds.SectionID=b.SectionID
                            inner join dbo.[HumanResource_EmployeeBasic] c on c.SectionID = b.SectionID 
                            WHERE  a.UnitId=${uData.id} and a.DepartmentId=${dData.id} and a.UserId=${UserId} and b.IsActive=1
                            order by SectionName 
                        end
                        else
                        begin
                            select distinct a.SectionID id,SectionName [text],'Sec' AS Tag
                            from dbo.[Common_Section] a
                            inner join dbo.[HumanResource_EmployeeBasic] b on a.SectionID = b.SectionID 
                            inner join R_DeptSection c on c.SectionID=a.SectionID
                            inner join R_UnitDept d on d.UDepID=c.UDepID
                            where b.UnitID=${uData.id} and b.DepartmentID=${dData.id} and a.IsActive=1
                            order by SectionName 
                        end`;

                        //let sectionSql=`exec sp_Select_Employee @desc1=${uData.id},@desc2=${dData.id},@desc3=${UserId},@calltype='Get_Employee_For_Tree_Section'`;

                        let sectionData=await executeSqlB(sectionSql);
                        const sectionDatas=sectionData.recordsets[0];

                        let sectionDtos=[];

                        if(sectionDatas.length){
                            sectionDtos=sectionDatas.reduce(async(preSection,sData)=>{
                            let wingSql=`
                            if exists(select * from UserSectionPermission where UserId=${UserId})--permission wise
                            begin
                                select distinct b.WingID id,b.WingName [text],'Wing' AS Tag
                                from UserWingPermission a
                                inner join dbo.[Common_Wing] b on a.WingId=b.WingID
                                inner join R_SecWing sw on sw.WingID=a.WingId
                                inner join dbo.[HumanResource_EmployeeBasic] c on c.WingID = b.WingID 
                                where a.UnitID=${uData.id} and a.DepartmentID=${dData.id} and a.SectionID=${sData.id} and a.UserId=${UserId} and b.IsActive=1
                                order by b.WingName
                            end
                            else
                            begin
                                select distinct a.WingID id,WingName [text],'Wing' AS Tag
                                from dbo.[Common_Wing] a
                                inner join R_SecWing c on c.WingID=a.WingID
                                inner join R_DeptSection e on e.DSecID=c.DSecID
                                inner join R_UnitDept d on d.UDepID=e.UDepID
                                inner join dbo.[HumanResource_EmployeeBasic] b on a.WingID = b.WingID 
                                where b.UnitID=${uData.id} and b.DepartmentID=${dData.id} and b.SectionID=${sData.id} and a.IsActive=1
                                order by WingName
                            end`;

                            // let wingSql=`exec sp_Select_Employee @desc1=${uData.id},@desc2=${dData.id},@desc3=${sData.id},@desc4=${UserId},@calltype='Get_Employee_For_Tree_Wing';`;
                            const wingData=await executeSqlB(wingSql);
                            
                            const wingDatas=wingData.recordsets[0];
                            let wingDtoss=[];

                            if(wingDatas.length){
                                wingDtoss=wingDatas.reduce(async(preWing,wData)=>{
                                let teamSql=`
                                if exists(select * from UserSectionPermission where UserId=${UserId})--permission wise
                                begin
                                    select distinct a.TeamID id,TeamName [text],'Team' AS Tag
                                    from UserTeamPermission a
                                    inner join dbo.[Common_Team] b on a.TeamId=b.TeamID
                                    inner join R_WingTeam wt on wt.TeamID=a.TeamId
                                    inner join dbo.[HumanResource_EmployeeBasic] c on c.TeamID = b.TeamID 
                                    where a.UnitID=${uData.id} and a.DepartmentID=${dData.id} and a.SectionID=${sData.id} and a.WingId=${wData.id} and a.UserId=${UserId} and b.IsActive=1
                                end
                                else
                                begin
                                    select distinct a.TeamID id,TeamName [text],'Team' AS Tag
                                    from dbo.[Common_Team] a
                                    inner join R_WingTeam w on w.TeamID=a.TeamID
                                    inner join R_SecWing c on c.SWingID=w.SWingID
                                    inner join R_DeptSection e on e.DSecID=c.DSecID
                                    inner join R_UnitDept d on d.UDepID=e.UDepID
                                    inner join dbo.[HumanResource_EmployeeBasic] b on a.TeamID = b.TeamID 
                                    where b.UnitID=${uData.id} and b.DepartmentID=${dData.id} and b.SectionID=${sData.id} and b.WingID=${wData.id} and a.IsActive=1
                                end`;

                                const teamData=await executeSqlB(teamSql);
                            
                                const teamDatas=teamData.recordsets[0];
                                let teamDatoss=[];

                                if(teamDatas.length){
                                    teamDatoss=teamDatas.reduce((preTeam,tData)=>{
                                    preTeam=[...preTeam,{teamId:tData.id,teamName:tData.text}]

                                    return preTeam;
                                    },[])
                                }
                                

                                preWing=[...await preWing,{
                                    wingId:wData.id,
                                    wingName:wData.text,
                                    teamDtos:teamDatoss
                                }]
                                return preWing;
                                },[])
                            }

                            preSection=[...await preSection,{
                                sectionId:sData.id,
                                sectionName:sData.text,
                                wingDtos:await wingDtoss
                            }]

                            return preSection;
                            },[])
                        }
                        preDepartment=[...await preDepartment,{
                            departmentId:dData.id,
                            departmentName:dData.text,
                            sectionDtos:await sectionDtos
                        }]

                        return preDepartment
                        },[])
                    }

                    preUnit=[...await preUnit,{
                        unitId:uData.id,
                        unitName:uData.text,
                        departmentDtos:await departmentDtos
                    }]
                    return preUnit;
                    },[])
                }
                return [
                    ...await preCompany,
                    {
                    companyId:cData.id,
                    companyName:cData.text,
                    unitDtos:await unitDts
                    }
                ];
                },[])


                res.status(200).json({IsSuccess:true,data:await response})
        
            }
        }catch{
            //return companyListsData;
        }
    }else{
        return res.status(500).json({message:'Internal Server Error!'})
    }
}

module.exports.GetTreeWithUserIdController=GetTreeWithUserIdController;