import axios from 'axios';
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  User,
  MessageResponse,
} from '../types/auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Register a new user account
 * POST /api/auth/register
 */
export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/api/auth/register', data);
  return response.data;
};

/**
 * Login with email and password
 * POST /api/auth/login
 * Returns JWT token and user data
 */
export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/api/auth/login', credentials);
  return response.data;
};

/**
 * Get current authenticated user
 * GET /api/auth/me
 * Requires Authorization header with Bearer token
 */
export const getCurrentUser = async (token: string): Promise<User> => {
  const response = await api.get<User>('/api/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Request password reset email
 * POST /api/auth/forgot-password
 */
export const forgotPassword = async (data: ForgotPasswordRequest): Promise<MessageResponse> => {
  const response = await api.post<MessageResponse>('/api/auth/forgot-password', data);
  return response.data;
};

/**
 * Reset password with token from email
 * POST /api/auth/reset-password
 */
export const resetPassword = async (data: ResetPasswordRequest): Promise<MessageResponse> => {
  const response = await api.post<MessageResponse>('/api/auth/reset-password', data);
  return response.data;
};
