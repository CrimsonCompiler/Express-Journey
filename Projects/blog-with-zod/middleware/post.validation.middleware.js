const {
  BLOGSCHEMA,
  updateBlogPostSchema,
} = require("../schema/blog.validation.schema");

// Custom middleware made by me
function validatePost(req, res, next) {
  const resultData = BLOGSCHEMA.safeParse(req.body);

  if (!resultData.success) {
    const errors = resultData.error.issues.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }));

    return res.status(422).json({
      message: "Post add failed",
      errors,
    });
  }

  req.validatePostData = resultData.data;
  next();
}

function validateUpdatePostData(req, res, next) {
  const resultData = updateBlogPostSchema.safeParse(req.body);

  if (!resultData.success) {
    const errors = resultData.error.issues.map((err) => ({
      field: err.path.join("."),
      errors,
    }));

    return res.status(422).json({
      message: "Updating failed due to validation errors",
    });
  }
  req.validatePostData = resultData.data;
  next();
}

module.exports = { validatePost, validateUpdatePostData };
