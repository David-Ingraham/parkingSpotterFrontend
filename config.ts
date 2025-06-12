import { BACKEND_URL } from '@env';

// Force HTTPS in production
const enforceHttps = (url: string): string => {
  if (!__DEV__ && url.startsWith('http://')) {
    return url.replace('http://', 'https://');
  }
  return url;
};

export const API_CONFIG = {
  baseUrl: enforceHttps(BACKEND_URL),
  timeout: 15000,
  retryAttempts: 3,
  retryDelay: 1000,
};

// Sanitize any user input before sending to backend
export const sanitizeInput = (input: string): string => {
  return input.replace(/[<>]/g, '').trim();
};

// Error messages for users (no implementation details)
export const ERROR_MESSAGES = {
  NETWORK: 'Unable to connect. Please check your connection.',
  SERVER: 'Service temporarily unavailable. Please try again later.',
  LOCATION: 'Location services are required for this feature.',
  TIMEOUT: 'Request timed out. Please try again.',
} as const;

// When running in Android Emulator, use 10.0.2.2 instead of localhost
export const BACKEND_URL_DEV = __DEV__ 
  ? 'http://10.0.2.2:8000'  // Development (Android Emulator)
  : 'http://localhost:8000'; // Production URL (replace with your actual production URL) 