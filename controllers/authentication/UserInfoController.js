const Joi = require("joi");
const {executeSqlB2}=require('../../util/db')


const schema = Joi.object().keys({
  UserId: Joi.string().trim().min(3).max(10).required(),
});

const UserInfoController = async (req, res) => {
  const isValidate = schema.validate(req.query);

  if (isValidate.error) {
    return res.status(400).json({ error: isValidate.error });
  }
  let data = [];
  try {
    const { UserId} = req.query;


    const getInfoSql=`Select * from UserInfo where EmpId='${UserId}'`;
    data = await executeSqlB2(getInfoSql);
    if (data.recordset.length > 0) {
        let dataOne=data.recordsets[0];
        let dataTwo=dataOne[0];

        // Delete UserPass from data
        delete dataTwo.UsrPass;

        return res.status(200).json({IsSuccess:true,data:dataTwo});
    }
    return res.status(500).json({
        IsSuccess:false,
        message: "Internal Server Error",
    });
  } catch (error) {
    return res.status(500).send("Internall server error");
  }
};


module.exports = UserInfoController;
