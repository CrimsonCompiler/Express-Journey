const express = require("express");
const {
  fetchAllBlogPost,
  fetchBlogPostById,
  postBlogPost,
  updateBlogPost,
  deleteBlogPost,
} = require("./controller/post.controller");

// required middlewares
const {
  validatePost,
  validateUpdatePostData,
} = require("./middleware/post.validation.middleware");
const app = express();
app.use(express.json());

app.get("/posts", fetchAllBlogPost);

app.get("/posts/:postId", fetchBlogPostById);

app.post("/posts", validatePost, postBlogPost);

app.patch("/posts/:postId", validateUpdatePostData, updateBlogPost);

app.delete("/posts/:postId", deleteBlogPost);

if (require.main === module) {
  app.listen(3000, () => console.log("Server running on port 3000"));
}

module.exports = { app };
