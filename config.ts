import { BACKEND_URL } from '@env';

// Force HTTPS in production
const enforceHttps = (url: string): string => {
  if (!__DEV__ && url.startsWith('http://')) {
    return url.replace('http://', 'https://');
  }
  return url;
};

// Get the appropriate backend URL
const getBackendUrl = (): string => {
  if (__DEV__) {
    // In development, use the environment variable or fallback to emulator URL
    return BACKEND_URL || 'http://10.0.2.2:8000';
  } else {
    // In production, use the environment variable (must be set)
    return enforceHttps(BACKEND_URL || 'https://your-production-domain.com');
  }
};

export const API_CONFIG = {
  baseUrl: getBackendUrl(),
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
 