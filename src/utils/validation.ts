import Joi from "joi";

// Joi schema for user creation validation
export const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().allow(null).optional(),
  username: Joi.string().alphanum().min(3).max(30).required(),
  image: Joi.string().allow(null).optional(),
  bio: Joi.string().allow(null).optional(),
  isVerified: Joi.boolean().default(false),
});
