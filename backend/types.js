const zod = require("zod");

const signUpInput = zod
  .object({
    name: zod.string(),
    email: zod.string().email(),
    // username: zod.string(),
    password: zod.string().min(8),
    confirmPassword: zod.string().min(8),
  })
  .partial()
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password must match",
    path: ["confirmPassword"],
  });

const signInInput = zod.object({
  email: zod.string().email(),
  password: zod.string().min(6),
});

const updateUserInput = zod
  .object({
    name: zod.string(),
    email: zod.string().email(),
    username: zod.string().optional(),
  })
  .partial();

const passwordUpdateInput = zod
  .object({
    password: zod.string().min(6),
    confirmPassword: zod.string().min(6),
  })
  .refine((pa) => pa.password === pa.confirmPassword, {
    message: "confirmPassword doesn't match...!!!",
    path: ["confirmPassword"],
  });

const createTodoInput = zod
  .object({
    user: zod.string(),
    title: zod.string(),
    description: zod.string(),
    dueDate: zod.date(),
    priority: zod.number(),
  })
  .partial();

const updateTodoInput = zod
  .object({
    title: zod.string(),
    description: zod.string(),
    dueDate: zod.date(),
    priority: zod.number(),
  })
  .partial();

module.exports = {
  signUpInput,
  signInInput,
  updateUserInput,
  createTodoInput,
  updateTodoInput,
  passwordUpdateInput,
};
