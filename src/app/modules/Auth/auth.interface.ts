export type TLoginUser = {
  email: string;
  password: string;
};

export type TJwtPayload = {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
};

export type TTokens = {
  accessToken: string;
  refreshToken: string;
};
