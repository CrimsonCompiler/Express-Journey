const router = require("express").Router();
const checkUserData = require("../middlewares/user.validate.middleware");

// POST/ /auth/signup
router.post("/signup", checkUserData,);

// POST/ /auth/login
