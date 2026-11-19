import { z } from 'zod';

const emailField = z
  .string({ error: 'Email is required' })
  .trim()
  .pipe(z.email({ error: 'Please provide a valid email address' }))
  .transform((val) => val.toLowerCase());

export const registerSchema = z.object({
  name: z
    .string({ error: 'Name is required' })
    .trim()
    .min(2, { error: 'Name must be at least 2 characters' })
    .max(50, { error: 'Name cannot exceed 50 characters' }),
  email: emailField,
  password: z
    .string({ error: 'Password is required' })
    .min(8, { error: 'Password must be at least 8 characters' })
    .max(128, { error: 'Password cannot exceed 128 characters' }),
  role: z.enum(['customer', 'admin']).optional(),
});

export const loginSchema = z.object({
  email: emailField,
  password: z
    .string({ error: 'Password is required' })
    .min(1, { error: 'Password is required' }),
});

export const updatePasswordSchema = z
  .object({
    currentPassword: z
      .string({ error: 'Current password is required' })
      .min(1, { error: 'Current password is required' }),
    newPassword: z
      .string({ error: 'New password is required' })
      .min(8, { error: 'New password must be at least 8 characters' })
      .max(128, { error: 'New password cannot exceed 128 characters' }),
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: emailField,
});

export const resetPasswordSchema = z.object({
  password: z
    .string({ error: 'New password is required' })
    .min(8, { error: 'Password must be at least 8 characters' })
    .max(128, { error: 'Password cannot exceed 128 characters' }),
});