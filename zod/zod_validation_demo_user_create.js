const express = require("express");
const { z } = require("zod");

const app = express();

app.use(express.json());

// userslist with registration info
let userslistSchema = z.object({
  firstName: z.string().min(6, "Firstname must be at least 6 characters"),
  lastName: z.string(),
  email: z.email("Invalid email format"),
  gender: z.string(),
  phoneNumber: z.string(),
});

let usersList = [];

app.get("/user", function (req, res) {
  res.status(200).json(usersList);
});

// Checker for the schema a middleware i guess
function checker(req, res, next) {
  const requestData = req.body;
  const checkerData = userslistSchema.safeParse(requestData);

  // console.log(checkerData);

  if (!checkerData.success) {
    const errorsData = checkerData.error.issues.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }));

    return res.status(422).json({
      status: "Registration Failed",
      errorsData,
    });
  }

  // Stroing all the sanitized data
  req.validatedData = checkerData.data;

  next();
}

app.post("/user", checker, function (req, res) {
  // const { firstName, lastName, email, gender, phoneNumber } = req.body;

  const newUser = req.validatedData;
  usersList.push(newUser);
  res.status(200).json({
    message: "Registration Successful",
  });
});

app.listen(3000);
