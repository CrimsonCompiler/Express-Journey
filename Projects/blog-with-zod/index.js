const express = require("express");
const { z } = require("zod");

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

// BLOGS LIST []
let blogsList = [
  {
    title: "Learning About Redux in React",
    content: "Redux is not just a state management it is a beast !",
    authorEmail: "tousif2567@gmail.com",
    tags: ["React", "Redux", "Web Development"],
  },
];

app.get("/posts", (req, res) => {
  if (blogsList.length === 0) {
    return res.status(204).send("No blogs post found");
  }

  return res.status(200).json(blogsList);
});

app.listen(3000);
