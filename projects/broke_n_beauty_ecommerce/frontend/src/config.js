/**
 * Application configuration
 * Handles environment-specific settings
 */

// Get API URL from environment variable
// Falls back to localhost for development
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Get environment
export const ENVIRONMENT = import.meta.env.VITE_ENVIRONMENT || 'development';

// Check if in production
export const IS_PRODUCTION = ENVIRONMENT === 'production';

// Debug logging in development only
export const DEBUG = !IS_PRODUCTION;

// Log configuration in development
if (DEBUG) {
  console.log('🔧 Configuration:', {
    API_URL,
    ENVIRONMENT,
    IS_PRODUCTION,
  });
}

// Export default config object
export default {
  API_URL,
  ENVIRONMENT,
  IS_PRODUCTION,
  DEBUG,
};