import { Schema, model, Model } from 'mongoose';
import bcrypt from 'bcrypt';
import { IUser, IUserModel } from './user.interface';
import config from '../../config';

// Create interface for User model
type UserModelType = Model<IUser, {}> & IUserModel;

const userSchema = new Schema<IUser, UserModelType>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
      minlength: [6, 'Password must be at least 6 characters'],
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    photoUrl: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Pre save middleware for password hashing
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_round || 10),
  );
  next();
});

// Post save middleware to remove password from response
userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

// Static methods
userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await User.findOne({ email }).select('+password');
};

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword: string,
  hashedPassword: string,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number,
) {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000;
  return passwordChangedTime > jwtIssuedTimestamp;
};

export const User = model<IUser, UserModelType>('User', userSchema);
