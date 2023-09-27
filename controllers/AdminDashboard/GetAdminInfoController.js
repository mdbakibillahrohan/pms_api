/*
* Author: Asib Al Hasan
* Title: Get Admin Info
* Description: Get admin HRM info details .
* Date: 30 July 2023
*/
const Joi = require("joi");
const {executeSqlB2}=require('../../util/db')


const schema = Joi.object().keys({
  EmpCode: Joi.string().trim().min(3).max(10).required(),
});

const GetAdminInfoController = async (req, res) => {
  const isValidate = schema.validate(req.query);

  if (isValidate.error) {
    return res.status(400).json({ error: isValidate.error });
  }
  let data = [];
  try {
    const { EmpCode} = req.query;


    const getInfoSql=`SELECT [EmpID]
        ,[EmpCode]
        ,[PunchNo]
        ,[Name]
        ,[DesignationID]
        ,[PositionID]
        ,[DesignationSpecId]
        ,[UnitID]
        ,[DepartmentID]
        ,[SectionID]
        ,[WingID]
        ,[TeamID]
        ,[JobLocationId]
        ,[EmpStatusID]
        ,[EmpTypeID]
        ,[EmpCategoryID]
        ,[GenderID]
        ,[ReligionID]
        ,[MaritalStatusID]
        ,[BloodGroupID]
        ,[NIDNo]
        ,[BirthCertificateNo]
        ,[CountryID]
        ,[NationalityID]
    FROM [CoreERP].[dbo].[HumanResource_EmployeeBasic] where EmpCode=${EmpCode}`;

    data = await executeSqlB2(getInfoSql);
    if (data.recordset.length > 0) {
        let info=data.recordsets[0];

        return res.status(200).json({IsSuccess:true,data:info[0]});
    }
    return res.status(500).json({
        IsSuccess:false,
        message: "Internal Server Error",
    });
  } catch (error) {
    return res.status(500).send("Internal server error");
  }
};


module.exports = GetAdminInfoController;
