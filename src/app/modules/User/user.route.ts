import { Router } from 'express';
import { UserControllers } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from './user.validation';

const router = Router();

// Public routes
router.post('/register', UserControllers.registerUser);

// Protected routes (require authentication)
router.get('/profile', UserControllers.getUserProfile);

router.patch(
  '/profile',
  validateRequest(UserValidation.updateProfileValidationSchema),
  UserControllers.updateProfile,
);

export const UserRoutes = router;
