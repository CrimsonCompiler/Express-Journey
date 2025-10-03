const express = require("express");
const { z } = require("zod");
const uuid = require("uuid");

const app = express();

app.use(express.json());

// BLOG SCHEMA

const BLOGSCHEMA = z
  .object({
    title: z
      .string()
      .min(5, "Title is too short")
      .max(100, "Title is too long"),
    content: z.string().min(20, "Content must be at least 20 characters"),
    authorEmail: z.string().email("Invalid email format"),
    tags: z.array(z.string()).optional(),
  })
  .strict();

const updateBlogPostSchema = BLOGSCHEMA.partial();

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
      message: err.message,
    }));

    return res.status(422).json({
      message: "Updating failed due to validation errors",
    });
  }
  req.validatePostData = resultData.data;
  next();
}

// BLOGS LIST []
let blogsList = [];

app.get("/posts", (req, res) => {
  if (blogsList.length === 0) {
    return res.status(204).send("No blogs post found");
  }

  return res.status(200).json(blogsList);
});

app.get("/posts/:postId", (req, res) => {
  const postId = String(req.params.postId);

  const resultData = blogsList.find((post) => post.postId === postId);

  if (!resultData) {
    return res.status(404).json({
      message: "Post not found",
    });
  }

  return res.status(200).json({
    post: resultData,
  });
});

app.post("/posts", validatePost, (req, res) => {
  const validatedPostData = req.validatePostData;

  // generating a new id for a specific post
  const uniqueId = uuid.v4();

  // creating a newPost with the uniqueId
  const newPost = {
    postId: uniqueId,
    ...validatedPostData,
  };

  blogsList.push(newPost);

  res.status(200).json({
    message: "Post add successfully",
    post: newPost,
  });
});

app.put("/posts/:postId", validateUpdatePostData, (req, res) => {
  const postId = req.params.postId;

  const validatedPostData = req.validatePostData;
  const postFoundIndex = blogsList.findIndex((post) => post.postId === postId);

  if (postFoundIndex === -1) {
    return res.status(404).json({
      message: "Post not found",
    });
  }

  const updatePost = { ...blogsList[postFoundIndex], ...validatedPostData };
  blogsList[postFoundIndex] = updatePost;

  return res.status(200).json({
    message: "Post updated successfully",
    post: updatePost,
  });
});

app.delete("/posts/:postId", (req, res) => {
  const postId = req.params.postId;

  const resultData = blogsList.some((post) => post.postId === postId);

  if (!resultData) {
    return res.status(404).json({
      message: "Post not found",
    });
  }

  blogsList = blogsList.filter((post) => post.postId !== postId);
  return res.status(200).json({
    message: "Post deleted successfully",
  });
});

app.listen(3000);
