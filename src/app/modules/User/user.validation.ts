import { z } from 'zod';

export const registerUserValidationSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(1, 'Name cannot be empty')
    .max(50, 'Name cannot exceed 50 characters')
    .trim(),
  email: z
    .string({ required_error: 'Email is required' })
    .email('Please provide a valid email address')
    .toLowerCase()
    .trim(),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters'),
  profileUrl: z.string().url('Please provide a valid image URL'),
});

export const updateProfileValidationSchema = z.object({
  name: z
    .string()
    .min(1, 'Name cannot be empty')
    .max(50, 'Name cannot exceed 50 characters')
    .trim()
    .optional(),
  profileUrl: z.string().url('Please provide a valid image URL').optional(),
});

export const UserValidation = {
  registerUserValidationSchema,
  updateProfileValidationSchema,
};
