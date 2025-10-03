const express = require("express");
const uuid = require("uuid");

const app = express();

app.use(express.json());


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
