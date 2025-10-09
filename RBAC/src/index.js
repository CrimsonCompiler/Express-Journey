require("dotenv").config();
const express = require("express");
const { dbConnect } = require("./config/config.db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const app = express();

dbConnect();

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("<h1>Working this server</h1>");
});

app.listen(3000, () => {
  console.log(`Server is running on port: ${3000}`);
});
