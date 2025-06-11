// When running in Android Emulator, use 10.0.2.2 instead of localhost
export const BACKEND_URL = __DEV__ 
  ? 'http://10.0.2.2:8000'  // Development (Android Emulator)
  : 'http://localhost:8000'; // Production URL (replace with your actual production URL) 