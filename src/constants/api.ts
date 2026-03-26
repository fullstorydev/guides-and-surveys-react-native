/**
 * API Configuration
 * Central location for all API URLs and endpoints
 */

export type Environment = 'playpen' | 'staging' | 'production';

// Base hosts without a realm prefix. The realm (e.g. "eu1") is injected as a
// subdomain when present: guides.fullstory.com → guides.eu1.fullstory.com
const BASE_HOSTS: Record<Environment, string> = {
  playpen: 'guides.onfire.fyi',
  staging: 'guides.staging.fullstory.com',
  production: 'guides.fullstory.com',
};

/**
 * Parses the realm suffix from a new-style org ID (e.g. "o-XXXXX-eu1" → "eu1").
 * Returns undefined for legacy org IDs or when the realm is "na1" (the default NA realm).
 *
 * Equivalent to `orgLocale` in the web recording package (fsglobals.ts) and
 * the iOS `orgLocale()` function in FSConfig.m.
 * Org ID format: https://www.notion.so/Org-and-Umbrella-IDs-690e4aebad984d41a737c9619b70266c
 */
export function orgLocale(orgId?: string): string | undefined {
  const sections = orgId?.split('-') ?? [];
  if (sections.length < 3) {
    return undefined;
  }
  const prefix = sections[0];
  const realm = sections[sections.length - 1];
  // A standard type prefix has only one character (o, u, p, …).
  // More than one character means a legacy org ID that happens to contain hyphens.
  if (realm === 'na1' || (prefix?.length ?? 0) > 1) {
    return undefined;
  }
  return realm;
}

/**
 * Returns the base URL for the given environment, with the realm injected as a
 * subdomain when present. Mirrors `fullstoryHost()` in the web recording package.
 *
 * Examples:
 *   getBaseUrl('production', undefined) → https://guides.fullstory.com
 *   getBaseUrl('production', 'eu1')     → https://guides.eu1.fullstory.com
 *   getBaseUrl('staging', 'eu1')        → https://guides.eu1.staging.fullstory.com
 */
export function getBaseUrl(
  environment: Environment,
  realm: string | undefined
): string {
  const host = BASE_HOSTS[environment];
  if (realm) {
    const dot = host.indexOf('.');
    const firstLabel = host.slice(0, dot);
    const rest = host.slice(dot);
    // Avoid double-inserting if the realm is already present after the first label.
    if (!rest.startsWith(`.${realm}.`)) {
      return `https://${firstLabel}.${realm}${rest}`;
    }
  }
  return `https://${host}`;
}

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
