const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../db");

// User Routes
router.post("/signup", async (req, res) => {
  // Implement user signup logic
  const { username, password } = req.body;
  try {
    await User.create({
      username: username,
      password: password,
    });
    res.status(201).json({
      message: "User created successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to create an user due to a server error",
    });
  }
});

router.get("/courses", async (req, res) => {
  // Implement listing all courses logic
  try {
    const allCourses = await Course.find({});
    res.status(200).json(allCourses);
  } catch (err) {
    return res.status(500).json({
      message: "Failed to retrieve all the courses due to a server error",
    });
  }
});

router.post("/courses/:courseId", userMiddleware, async (req, res) => {
  // Implement course purchase logic
  const { courseId } = req.params;
  const { username } = req.headers;

  try {
    await User.updateOne(
      {
        username: username,
      },
      {
        $push: {
          purchasedCourses: courseId,
        },
      }
    );
    res.status(200).json({
      message: "Purchase complete",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to purchase course",
    });
  }
});

router.get("/purchasedCourses", userMiddleware, async (req, res) => {
  // Implement fetching purchased courses logic
  const { username } = req.headers;
  try {
    const userFound = await User.findOne({ username });
    const courses = await Course.find({
      _id: {
        $in: userFound.purchasedCourses,
      },
    });
    res.json({
      courses: courses,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to retrieve courses due to a server error",
    });
  }
});

module.exports = router;
