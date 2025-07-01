import { Router } from 'express';
import { UserControllers } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from './user.validation';

const router = Router();

// Public routes
router.post('/register', UserControllers.registerUser);

router.get('/', UserControllers.getAllUsers);

router.patch(
  '/profile',
  validateRequest(UserValidation.updateProfileValidationSchema),
  UserControllers.updateProfile,
);

export const UserRoutes = router;
