const { z } = require("zod");

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

module.exports = { BLOGSCHEMA, updateBlogPostSchema };
