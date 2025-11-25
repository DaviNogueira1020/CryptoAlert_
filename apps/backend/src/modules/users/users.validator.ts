const { z } = require("zod");

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
});

const updateUserSchema = createUserSchema.partial();

module.exports = { createUserSchema, updateUserSchema };
