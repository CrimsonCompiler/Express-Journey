const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const roleCheck = require("../middlewares/roleMiddleware");

router.get("/admin", verifyToken, roleCheck("admin"), (req, res) => {
  res.json({
    messag: "Welcome, Admin",
  });
});

router.get(
  "/manager",
  verifyToken,
  roleCheck("admin", "manager"),
  (req, res) => {
    res.json({
      messag: "Welcome, Manager",
    });
  }
);

router.get(
  "/user",
  verifyToken,
  roleCheck("admin", "manager", "user"),
  (req, res) => {
    res.json({
      messag: "Welcome, User",
    });
  }
);

module.exports = router;
