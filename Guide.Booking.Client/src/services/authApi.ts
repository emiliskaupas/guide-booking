import api from './apiClient';
import type { AuthResponseDto, RegisterDto, LoginDto, RefreshTokenDto } from '../types';

export const authAPI = {
  register: async (data: RegisterDto): Promise<AuthResponseDto> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginDto): Promise<AuthResponseDto> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  refresh: async (data: RefreshTokenDto): Promise<AuthResponseDto> => {
    const response = await api.post('/auth/refresh', data);
    return response.data;
  },
};
