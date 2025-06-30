import { Router } from 'express';
import { EventControllers } from './event.controller';
import validateRequest from '../../middlewares/validateRequest';
import { EventValidation } from './event.validation';
import auth from '../../middlewares/auth'; // Assuming you have auth middleware

const router = Router();

// Public routes
router.get('/', EventControllers.getAllEvents);
router.get(
  '/:eventId',
  validateRequest(EventValidation.getEventValidationSchema),
  EventControllers.getSingleEvent,
);

// Protected routes - require authentication
router.post(
  '/create',
  auth(), // Add authentication middleware
  validateRequest(EventValidation.createEventValidationSchema),
  EventControllers.createEvent,
);

router.patch(
  '/:eventId',
  auth(), // Add authentication middleware
  validateRequest(EventValidation.updateEventValidationSchema),
  EventControllers.updateEvent,
);

router.delete(
  '/:eventId',
  auth(), // Add authentication middleware
  validateRequest(EventValidation.getEventValidationSchema),
  EventControllers.deleteEvent,
);

router.post(
  '/:eventId/join',
  auth(), // Add authentication middleware
  validateRequest(EventValidation.joinEventValidationSchema),
  EventControllers.joinEvent,
);

router.get(
  '/my/events',
  auth(), // Add authentication middleware
  EventControllers.getMyEvents,
);

router.get(
  '/joined/events',
  auth(), // Add authentication middleware
  EventControllers.getJoinedEvents,
);

export const EventRoutes = router;
