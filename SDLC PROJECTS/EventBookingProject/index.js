const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRouter = require("./routes/user.routes");

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/user", userRouter);

app.get("/", (req, res) => {
  res.json({
    message: "Server is Running",
  });
});

app.listen(3000, () => {
  console.log(`Server is running at: ${process.env.PORT || 3000}`);
});
