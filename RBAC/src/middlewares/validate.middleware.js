const {
  userRegisterValidationSchema,
  userLoginValidationSchema,
} = require("../validation/userValidation");

const registerValidation = (req, res, next) => {
  const requestData = req.body;
  const checkerData = userRegisterValidationSchema.safeParse(requestData);

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
  req.registerData = checkerData.data;
  next();
};

const loginValidation = (req, res, next) => {
  const requestData = req.body;
  const checkerData = userLoginValidationSchema.safeParse(requestData);

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
  req.loginData = checkerData.data;
  next();
};

module.exports = { registerValidation, loginValidation };
