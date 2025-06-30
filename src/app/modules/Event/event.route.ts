import { Router } from 'express';
import { EventControllers } from './event.controller';
import validateRequest from '../../middlewares/validateRequest';
import { EventValidation } from './event.validation';

const router = Router();

// Public routes
router.get('/', EventControllers.getAllEvents);
router.get(
  '/:eventId',
  validateRequest(EventValidation.getEventValidationSchema),
  EventControllers.getSingleEvent,
);

router.post(
  '/create',
  validateRequest(EventValidation.createEventValidationSchema),
  EventControllers.createEvent,
);

router.patch(
  '/:eventId',
  validateRequest(EventValidation.updateEventValidationSchema),
  EventControllers.updateEvent,
);

router.delete(
  '/:eventId',
  validateRequest(EventValidation.getEventValidationSchema),
  EventControllers.deleteEvent,
);

router.post(
  '/:eventId/join',
  validateRequest(EventValidation.joinEventValidationSchema),
  EventControllers.joinEvent,
);

router.get('/my/events', EventControllers.getMyEvents);

router.get('/joined/events', EventControllers.getJoinedEvents);

export const EventRoutes = router;
