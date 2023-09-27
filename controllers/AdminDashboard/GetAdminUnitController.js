/*
* Author: Asib Al Hasan
* Title: Get User Unit With ID
* Description: Jodi user er Admin dashboard permission thke taile tar initiale vabe dashboard er kichu data load korano lagbe . Er jnno tar unit details lagbe . 
* Date: 30 July 2023
*/

const Joi = require("joi");
const {executeSqlB}=require('../../util/db')


const schema = Joi.object().keys({
  EmpCode: Joi.string().trim().min(3).max(10).required(),
});

const GetAdminUnitController = async (req, res) => {
  const isValidate = schema.validate(req.query);

  if (isValidate.error) {
    return res.status(400).json({ error: isValidate.error });
  }
  let data = [];
  try {
    const { EmpCode} = req.query;


    const getInfoSql=`Select un.UnitId,un.UnitName,un.CompanyID from dbo.[HumanResource_EmployeeBasic] h
    inner join dbo.[Common_Unit] un on h.UnitID=un.UnitId
    inner join dbo.[Common_Company] cm on un.CompanyID=cm.CompanyId
    where h.EmpCode=${EmpCode}`;
    data = await executeSqlB(getInfoSql);
    //console.log("DD",data)
    if (data.recordset.length > 0) {
        let info=data.recordsets[0];

        return res.status(200).json({IsSuccess:true,data:info[0]});
    }
    return res.status(500).json({
        IsSuccess:false,
        message: "Internal Server Error",
    });
  } catch (error) {
    return res.status(500).send("Internall server error");
  }
};


module.exports = GetAdminUnitController;
