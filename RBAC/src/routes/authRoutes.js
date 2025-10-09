const express = require("express");
const router = express.Router();
const {
  registerValidation,
  loginValidation,
} = require("../middlewares/validate.middleware");
const {
  registerController,
  loginController,
} = require("../controllers/authController");

router.post("/register", registerValidation, registerController);
router.post("/login", loginValidation, loginController);

module.exports = router;
