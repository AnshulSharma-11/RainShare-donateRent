import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().min(10, 'Enter a valid phone number').max(15),
  role: z.enum(['donor', 'renter'], { required_error: 'Select a role' }),
});

export const gearSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category_id: z.string().or(z.number()).transform(Number),
  condition: z.enum(['new', 'good', 'fair', 'worn']),
  rent_price: z.number().min(0, 'Price cannot be negative'),
  image_url: z.string().url('Enter a valid image URL').or(z.string().length(0)),
  status: z.enum(['available', 'donated', 'rented']),
});

export const volunteerSchema = z.object({
  city: z.string().min(2, 'Enter your city'),
  availability: z.array(z.string()).min(1, 'Select at least one availability'),
  motivation: z.string().min(10, 'Tell us a bit more (min 10 chars)').optional(),
});

export const rentalSchema = z.object({
  rent_date: z.string().min(1, 'Select a start date'),
  return_date: z.string().min(1, 'Select a return date'),
}).refine((data) => new Date(data.return_date) > new Date(data.rent_date), {
  message: 'Return date must be after rent date',
  path: ['return_date'],
});
