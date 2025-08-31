import * as yup from 'yup';

// Login validation schema
export const loginSchema = yup.object({
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

// User validation schema
export const userSchema = yup.object({
  fullName: yup
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .required('Full name is required'),
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  role: yup
    .string()
    .oneOf(['admin', 'user'], 'Role must be either admin or user')
    .required('Role is required'),
});

// User update validation schema (password optional)
export const userUpdateSchema = yup.object({
  fullName: yup
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .required('Full name is required'),
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .optional(),
  role: yup
    .string()
    .oneOf(['admin', 'user'], 'Role must be either admin or user')
    .required('Role is required'),
});

// Category validation schema
export const categorySchema = yup.object({
  name: yup
    .string()
    .min(2, 'Category name must be at least 2 characters')
    .required('Category name is required'),
  description: yup
    .string()
    .optional(),
});

// Subcategory validation schema
export const subcategorySchema = yup.object({
  name: yup
    .string()
    .min(2, 'Subcategory name must be at least 2 characters')
    .required('Subcategory name is required'),
  description: yup
    .string()
    .optional(),
  categoryId: yup
    .string()
    .required('Parent category is required'),
});

// Item validation schema
export const itemSchema = yup.object({
  title: yup
    .string()
    .min(2, 'Title must be at least 2 characters')
    .required('Title is required'),
  description: yup
    .string()
    .optional(),
  type: yup
    .string()
    .oneOf(['pdf', 'youtube_url'], 'Type must be either pdf or youtube_url')
    .required('Type is required'),
  subcategoryId: yup
    .string()
    .required('Subcategory is required'),
  file_path: yup
    .string()
    .when('type', {
      is: 'pdf',
      then: (schema) => schema.required('File path is required for PDF type'),
      otherwise: (schema) => schema.optional(),
    }),
  youtube_url: yup
    .string()
    .url('Must be a valid URL')
    .when('type', {
      is: 'youtube_url',
      then: (schema) => schema.required('YouTube URL is required for YouTube type'),
      otherwise: (schema) => schema.optional(),
    }),
});

