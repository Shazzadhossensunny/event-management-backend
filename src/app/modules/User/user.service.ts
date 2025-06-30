import { StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';
import AppError from '../../errors/AppError';
import { TRegisterUser, TUpdateProfile } from './user.interface';
import { User } from './user.model';

const registerUser = async (payload: TRegisterUser) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email: payload.email });
  if (existingUser) {
    throw new AppError(
      StatusCodes.CONFLICT,
      'User already exists with this email',
    );
  }

  const result = await User.create(payload);

  // Return user without password
  const user = await User.findById(result._id).select('-password');
  return user;
};

const getUserProfile = async (userId: string) => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid user ID');
  }

  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }
  return user;
};

const updateProfile = async (userId: string, payload: TUpdateProfile) => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid user ID');
  }

  const user = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  }).select('-password');

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }

  return user;
};

const getAllUsers = async (page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;

  const users = await User.find()
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments();

  return {
    users,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalUsers: total,
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    },
  };
};

export const UserServices = {
  registerUser,
  getUserProfile,
  updateProfile,
  getAllUsers,
};
