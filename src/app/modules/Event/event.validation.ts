import { z } from 'zod';

const createEventValidationSchema = z.object({
  body: z.object({
    title: z
      .string({ required_error: 'Event title is required' })
      .min(1, 'Event title cannot be empty')
      .max(100, 'Event title cannot exceed 100 characters')
      .trim(),
    name: z
      .string({ required_error: 'Organizer name is required' })
      .min(1, 'Organizer name cannot be empty')
      .max(50, 'Organizer name cannot exceed 50 characters')
      .trim(),
    dateTime: z
      .string({ required_error: 'Event date and time is required' })
      .datetime('Please provide a valid date and time in ISO format')
      .refine(
        (date) => new Date(date) > new Date(),
        'Event date and time must be in the future',
      ),
    location: z
      .string({ required_error: 'Event location is required' })
      .min(1, 'Event location cannot be empty')
      .max(200, 'Location cannot exceed 200 characters')
      .trim(),
    description: z
      .string({ required_error: 'Event description is required' })
      .min(1, 'Event description cannot be empty')
      .max(1000, 'Description cannot exceed 1000 characters')
      .trim(),
    attendeeCount: z
      .number()
      .min(0, 'Attendee count cannot be negative')
      .optional()
      .default(0),
  }),
});

const updateEventValidationSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(1, 'Event title cannot be empty')
      .max(100, 'Event title cannot exceed 100 characters')
      .trim()
      .optional(),
    name: z
      .string()
      .min(1, 'Organizer name cannot be empty')
      .max(50, 'Organizer name cannot exceed 50 characters')
      .trim()
      .optional(),
    dateTime: z
      .string()
      .datetime('Please provide a valid date and time in ISO format')
      .refine(
        (date) => new Date(date) > new Date(),
        'Event date and time must be in the future',
      )
      .optional(),
    location: z
      .string()
      .min(1, 'Event location cannot be empty')
      .max(200, 'Location cannot exceed 200 characters')
      .trim()
      .optional(),
    description: z
      .string()
      .min(1, 'Event description cannot be empty')
      .max(1000, 'Description cannot exceed 1000 characters')
      .trim()
      .optional(),
  }),
});

const joinEventValidationSchema = z.object({
  params: z.object({
    eventId: z
      .string({ required_error: 'Event ID is required' })
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid event ID format'),
  }),
});

const getEventValidationSchema = z.object({
  params: z.object({
    eventId: z
      .string({ required_error: 'Event ID is required' })
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid event ID format'),
  }),
});

export const EventValidation = {
  createEventValidationSchema,
  updateEventValidationSchema,
  joinEventValidationSchema,
  getEventValidationSchema,
};
