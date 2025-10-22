const router = require("express").Router();
const usersList = require("../utils/usersList");
const checkUserData = require("../middlewares/user.validate.middleware");

router.post("/list", checkUserData, (req, res) => {
  const newUser = req.validatedUserData;

  usersList.push(newUser);

  res.status(200).json({
    message: "User adding successful",
  });
});

router.get("/list/:userId", (req, res) => {
  const userId = req.params.userId;

  try {
    const foundUser = usersList.find((u) => u.userId === userId);
    if (!foundUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.status(201).json({
      userData: foundUser,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to retrieve an user due to server error",
    });
  }
});

router.get("/list", (req, res) => {
  res.json({
    usersList,
  });
});

module.exports = router;
