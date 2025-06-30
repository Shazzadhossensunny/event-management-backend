import { Document, Types } from 'mongoose';

export type TRegisterUser = {
  name: string;
  email: string;
  password: string;
  photoUrl: string;
};

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  isActive: boolean;
  photoUrl: string;
}

export interface IUserModel extends Document {
  isUserExistsByEmail(email: string): Promise<IUser | null>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}

export type TUpdateProfile = {
  name?: string;
  profileImage?: string;
};
