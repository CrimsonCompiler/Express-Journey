const uuid = require("uuid");

// BLOGS LIST []
let blogsList = [];

const fetchAllBlogPost = (req, res) => {
  if (blogsList.length === 0) {
    return res.status(204).send("No blogs post found");
  }

  return res.status(200).json(blogsList);
};

const fetchBlogPostById = (req, res) => {
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
};

const postBlogPost = (req, res) => {
  const validatedPostData = req.validatePostData;

  // generating a new id for a specific post
  const uniqueId = uuid.v4();

  // creating a newPost with the uniqueId
  const newPost = {
    postId: uniqueId,
    ...validatedPostData,
  };

  blogsList.push(newPost);

  res.status(201).json({
    message: "Post created successfully",
    post: newPost,
  });
};

const updateBlogPost = (req, res) => {
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
};

const deleteBlogPost = (req, res) => {
  const postId = req.params.postId;

  const resultData = blogsList.some((post) => post.postId === postId);

  if (!resultData) {
    return res.status(404).json({
      message: "Post not found",
    });
  }

  blogsList.splice(postId, 1);
  return res.status(204).json({
    message: "Post deleted successfully",
  });
};

module.exports = {
  fetchAllBlogPost,
  fetchBlogPostById,
  postBlogPost,
  updateBlogPost,
  deleteBlogPost,
  blogsList,
};
