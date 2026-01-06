/**
 * API Configuration
 * Central location for all API URLs and endpoints
 */
export const API_CONFIG = {
  BASE_URL: 'https://www.usetiful.com',
  // BASE_URL: 'https://admin:admin123@dev.usetiful.com', // Dev environment
  PROGRESSOR_URL: 'https://progressor.usetiful.com/api/get',
  ENDPOINTS: {
    DATA: '/api-space/data.json',
  },
  DEFAULT_PARAMS: {
    lang: 'en',
    app: 'mobile',
  },
} as const;
