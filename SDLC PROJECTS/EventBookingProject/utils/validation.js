const z = require("zod");

const userValidation = z.object({
  user_name: z.string().min(7, "User name must be atleast 7 characters"),
  email: z.email(),
  password: z.string().min(8, "Password must be atleast 8 characters"),
  role: z.enum(["admin", "user"]).default("user"),
});

module.exports = userValidation;
