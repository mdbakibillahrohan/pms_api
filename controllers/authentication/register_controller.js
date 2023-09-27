const {executeSqlB} = require("../../util/db");
const Joi = require("joi");
const bcrypt = require("bcrypt");

const schema = Joi.object().keys({
  firstname:Joi.string().alphanum().min(3).max(50).required(),
  lastname: Joi.string().alphanum().min(3).max(50).required(),
  username: Joi.string().alphanum().min(3).max(10).required(),
  email: Joi.string().email().required(),
  role: Joi.string().alphanum().min(3).max(10).required(),
  password: Joi.string().trim().min(5).max(15).required(),
});

const registerController = async (req, res) => {
  const isValidate = schema.validate(req.body);
  if (isValidate.error) {
    return res.status(400).json({ error: isValidate.error });
  }

  try {
    const isDuplicate =await duplicateEntryCheck(req);
    //console.log(isDuplicate)
    if (isDuplicate) {
      return res
        .status(400)
        .json({ message: "duplicate entry of username or password" });
    }
    const register = await registerUser(req);
    //console.log("REG",register)
    if (register.insertId > 0) {
      return res.status(200).json({ message: "Registration successful" });
    } else {
      res.status(401).send("Something went wrong");
    }
  } catch (error) {
    res.status(500).send("Internal server error");
    throw error;
  }
};

const registerUser = async (req) => {
  const { firstname,lastname, username, email,role, password } = req.body;
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const sql = "INSERT INTO users(firstname,lastname, username, email,role, password) VALUES ?";
    const values=[[firstname,lastname, username, email,role, hashedPassword]];

    const register = await executeSqlB(sql);
    //console.log("REG",register)
    return register;
  } catch (error) {
    throw error;
  }
};

const duplicateEntryCheck = async(req) => {
  const { username, email } = req.body;

  try {
    sql =  "select * from users where email= ? or username= ?";
    const values=[email,username]
    const data =await executeSqlB(sql);
    //console.log("DD",data)
    return data.length > 0 ? true : false;
  } catch (error) {
    throw error;
  }
};

const generateToken = async (req) => {
  const { email } = req.body;
  try {
    sql = {
      text: "select name, email, role from users where email = $1",
      values: [email],
    };
    const data = await executeSqlB(sql);
    console;
  } catch (error) {
    throw error;
  }
};

module.exports = registerController;
