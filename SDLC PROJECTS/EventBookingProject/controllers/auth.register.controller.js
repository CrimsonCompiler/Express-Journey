const usersList = require("../utils/usersList");
const jwt = require("jsonwebtoken");

const registerController = (req, res) => {
  const newUser = req.validatedUserData;

  try {
    const { email } = newUser;

    const foundUser = usersList.find((u) => u.email === email);
    if (!foundUser) {
      usersList.push(newUser);

      res.status(201).json({
        message: "User registration successful",
      });
    } else {
      res.status(409).json({
        message: "User with this email already exists",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Registration failed due to an server error",
    });
  }
};

const loginController = (req, res) => {
    const newUser = req.validatedUserData;

    try{

    }catch(err){
      
    }
};

module.exports = registerController;
