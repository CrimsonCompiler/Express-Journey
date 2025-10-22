const userValidation = require("../utils/validation");

const checkUserData = (req, res, next) => {
  console.log(req.body);
  const checkedData = userValidation.safeParse(req.body);

  if (!checkedData.success) {
    const errorsList = checkedData.error.issues.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));

    return res.status(422).json({
      message: "Registration Failed",
      errors: errorsList,
    });
  }

  req.validatedUserData = checkedData.data;
  next();
};

module.exports = checkUserData;
