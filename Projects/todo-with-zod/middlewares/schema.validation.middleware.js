const { todoSchema, updateTodoSchema } = require("../schema/zod.schema");

// Custom middlewares
function todoValidation(req, res, next) {
  const checkerData = todoSchema.safeParse(req.body);

  if (!checkerData.success) {
    const errors = checkerData.error.issues.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }));

    return res.status(422).json({
      message: "Todo add failed",
      errors,
    });
  }

  req.validatedTodo = checkerData.data;
  next();
}

// Custom updating middlewares
function validateUpdateData(req, res, next) {
  const data = req.body;
  const checkerData = updateTodoSchema.safeParse(data);

  if (!checkerData.success) {
    const errors = checkerData.error.issues.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }));

    return res.status(422).json({
      message: "Updating failed due to validation errors",
      errors,
    });
  }

  req.validatedData = checkerData.data;
  next();
}

module.exports = { todoValidation, validateUpdateData };
