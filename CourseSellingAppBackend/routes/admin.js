const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const { Admin, Course } = require("../db");
const router = Router();

// Admin Routes
router.post("/signup", async (req, res) => {
  // Implement admin signup logic
  const { username, password } = req.body;
  try {
    const newAdmin = await Admin.create({
      username: username,
      password: password,
    });

    res.status(201).json({
      message: "Admin created successfully",
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Username already exists." });
    }
    return res.status(500).json({
      message: "Failed to create an admin due to server error",
    });
  }
});

router.post("/courses", adminMiddleware, async (req, res) => {
  // Implement course creation logic
  const { title, description, price, imageLink } = req.body;
  try {
    const newCourse = await Course.create({
      title,
      description,
      price,
      imageLink,
    });
    res.status(201).json({
      message: "Course created successfully",
      courseId: (await newCourse)._id,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ message: "A course with this title already exists." });
    }
    return res
      .status(500)
      .json({ message: "Failed to create the course due to a server error." });
  }
});

router.get("/courses", adminMiddleware, async (req, res) => {
  // Implement fetching all courses logic

  try {
    const allCourses = await Course.find({});
    res.json({
      courseData: allCourses,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to retrieve all courses due to a server error",
    });
  }
});

module.exports = router;
