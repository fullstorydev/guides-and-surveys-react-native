/**
 * API Configuration
 * Central location for all API URLs and endpoints
 */

export type Environment = 'playpen' | 'staging' | 'production';

const BASE_URLS: Record<Environment, string> = {
  playpen: 'https://guides.onfire.fyi',
  staging: 'https://guides.staging.fullstory.com',
  production: 'https://guides.fullstory.com',
};

export const getBaseUrl = (environment: Environment): string =>
  BASE_URLS[environment];

export const API_CONFIG = {
  ENDPOINTS: {
    DATA: '/api-space/data.json',
    PROGRESSOR_GET: '/progressor/api/get',
    PROGRESSOR_SAVE: '/progressor/api/save',
    SURVEY_RESPONSES: '/reporter/api/surveys',
  },
  DEFAULT_PARAMS: {
    lang: 'en',
    app: 'mobile',
  },
} as const;
