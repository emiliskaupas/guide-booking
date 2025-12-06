export interface AuthResponseDto {
  token: string;
  refreshToken: string;
  username: string;
  email: string;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface User {
  username: string;
  email: string;
}
