const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("./models/user.schema");
const Exercise = require("./models/exercise.schema");
require("dotenv").config();

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("Database connected successfully!"))
  .catch((err) => console.error("Database connection error:", err));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/users", async (req, res) => {
  const { username } = req.body;
  try {
    const newUser = new User({ username });
    const savedUser = await newUser.save();
    res.json({
      username: savedUser.username,
      _id: savedUser._id,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to create user" });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find({});
    const listOfUsers = users.map((user) => ({
      _id: user._id,
      username: user.username,
    }));
    res.json(listOfUsers);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve users" });
  }
});

app.post("/api/users/:_id/exercises", async (req, res) => {
  const { _id } = req.params;
  const { description, duration, date } = req.body;

  try {
    const user = await User.findById(_id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
    }

    const newExercise = new Exercise({
      userId: user._id,
      date: date ? new Date(date) : new Date(),
      duration: duration,
      description: description,
    });

    const savedExercise = await newExercise.save();

    res.json({
      _id: savedExercise.userId,
      username: user.username,
      date: savedExercise.date.toDateString(),
      duration: savedExercise.duration,
      description: savedExercise.description,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to add exercise" });
  }
});

app.get("/api/users/:_id/logs", async (req, res) => {
  const { _id } = req.params;
  const { from, to, limit } = req.query;

  try {
    const user = await User.findById(_id);

    if (!user) {
      res.status(404).json({ error: "user not found" });
    }

    let filterObject = { userId: _id };
    let dateFilter = {};

    if (from) {
      dateFilter["$gte"] = new Date(from);
    }
    if (to) {
      dateFilter["$lte"] = new Date(to);
    }

    if (from || to) {
      filterObject.date = dateFilter;
    }

    const exercises = await Exercise.find(filterObject).limit(parseInt(limit));
    const log = exercises.map((e) => ({
      description: e.description,
      duration: e.duration,
      date: e.date.toDateString(),
    }));

    res.json({
      username: user.username,
      count: exercises.length,
      _id: user._id,
      log: log,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve logs" });
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
