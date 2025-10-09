const z = require("zod");

const userRegisterValidationSchema = z.object({
  username: z.string().min(6, "Name must minimum 6 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["admin", "manager", "user"]),
});

const userLoginValidationSchema = z.object({
  username: z.string().min(6, "Name must minimum 6 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
module.exports = { userRegisterValidationSchema, userLoginValidationSchema };
