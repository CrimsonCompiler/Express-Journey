const bcrypt = require("bcryptjs");
const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");

const registerController = async (req, res) => {
  try {
    const { username, password, role } = req.registerData;
    const hashedPassword = await bcrypt.hash(password, 12);

    // Creates a new user
    const newUser = new User({ username, password: hashedPassword, role });
    await newUser.save();

    // Registration response
    res
      .status(201)
      .json({ message: "Registration Successful", username: username });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Registration Failed" });
  }
};

const loginController = async (req, res) => {
  try {
    const { username, password } = req.loginData;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: "2h" }
    );

    res.status(200).json({ message: "Login Successful", token: token });
  } catch (err) {}
};

module.exports = { registerController, loginController };
