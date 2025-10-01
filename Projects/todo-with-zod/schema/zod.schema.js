const { z } = require("zod");

// TODO SCHEMA VALIDATION
const todoSchema = z.object({
  title: z.string().min(7, "Title must be at least 7 characters"),
  description: z.string(),
  status: z.enum(["pending", "completed"]),
});

// Update todo schema
const updateTodoSchema = todoSchema.partial(); // makes all the option of the todoSchema optional

module.exports = { todoSchema, updateTodoSchema };
