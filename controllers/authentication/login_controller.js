const Joi = require("joi");
const bcrypt = require("bcrypt");
const {ConvertPassString}=require('../../util/convertPass');
const {executeSqlB2}=require('../../util/db')
const jwt = require("jsonwebtoken");


const schema = Joi.object().keys({
  userid: Joi.string().trim().min(3).max(10).required(),
  password: Joi.string().trim().min(3).max(15).required(),
});

const loginController = async (req, res) => {
  const isValidate = schema.validate(req.body);

  if (isValidate.error) {
    return res.status(400).json({ error: isValidate.error });
  }
  let data = [];
  try {
    const { userid, password } = req.body;
    const passString=ConvertPassString(password);


    const loginSql=`Select * from UserInfo where EmpId='${userid}'`;
    data = await executeSqlB2(loginSql);
    if (data.recordset.length > 0) {
      let isPasswordCorrect =false;
      let dataPass=data.recordset[0].UsrPass

      if(dataPass===passString){
        isPasswordCorrect=true
      }
      if (isPasswordCorrect) {
        const token = generateToken(data.recordset[0]);
        return res.status(200).json({
          isSuccess:true,
          message: "Login success",
          UserId:data.recordset[0].UserId,
          EmpId:data.recordset[0].EmpId,
          EmpNo:data.recordset[0].EmpNo,
          UserName:data.recordset[0].UserName,
          token: token,
        });
      }else{
        return res.status(401).json({
          message:"Invalid Users."
        })
      }
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }
    return res.status(401).json({
      message: "Invalid credentials",
    });
  } catch (error) {
    return res.status(500).send("Internall server error");
  }
  res.json({
    data: data,
  });
};

const generateToken = (data) => {
  const newData = data;
  const dataForSign = {
    user: {
      EmpId: newData.EmpId,
      EmpNo:newData.EmpNo,
      UserName: newData.UserName,
    },
  };
  const token = jwt.sign(
    dataForSign, 
    process.env.JWT_SECRET,
    {
      expiresIn:'5h'
    }
    );
  return token;
};

module.exports = loginController;
