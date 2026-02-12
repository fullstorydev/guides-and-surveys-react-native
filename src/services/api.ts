import type { UsetifulResponse, ProgressorData } from '../types';
import { API_CONFIG } from '../constants/api';

/**
 * Fetches tour data from the Usetiful API
 * @param token - Authentication token
 * @returns Array of tours or empty array on error
 */
export const fetchDataJson = async (
  token: string
): Promise<UsetifulResponse | null> => {
  const reqUrl = `${API_CONFIG.PLAYPEN_BASE_URL}${API_CONFIG.ENDPOINTS.DATA}?lang=${API_CONFIG.DEFAULT_PARAMS.lang}&app=${API_CONFIG.DEFAULT_PARAMS.app}`;
  try {
    const response = await fetch(reqUrl, {
      method: 'GET',
      headers: {
        'x-org-id': token,
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json; charset=utf-8',
      },
    });

    if (!response.ok) {
      console.error(`USETIFUL HTTP ERROR - status: ${response.status}`);
      return null;
    }

    const res: UsetifulResponse = await response.json();

    console.log(`
      =============================================
      =============================================
      ============== USETIFUL =====================
      ================= IS ========================
      ============== LOADED =======================
      =============================================
      =============================================`);

    return res;
  } catch (error: any) {
    console.error('=====error====>', error.message);
    return null;
  }
};

/**
 * Fetches user progress data from the Progressor API
 * @param accountToken - Guide & Surveys space token
 * @param sessionId - Session ID to fetch progress for
 * @returns Progress data or null on error
 */
export const fetchProgressor = async (
  accountToken: string,
  sessionId: string
): Promise<ProgressorData | null> => {
  const url = `${API_CONFIG.PLAYPEN_BASE_URL}${API_CONFIG.ENDPOINTS.PROGRESSOR_GET}`;
  const headers = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  };
  const body = JSON.stringify({
    sessionId,
    accountToken,
  });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: body,
    });

    if (!response.ok) {
      console.error(
        '=======Error=====>',
        new Error(`Usetiful: connection error ${response.status}`)
      );
      return null;
    }

    const result = JSON.parse(await response.json());
    return result;
  } catch (error: any) {
    console.error('=======Error=====>', error.message);
    return null;
  }
};

/**
 * Saves user progress data to the Progressor API
 * @param accountToken - Guide & Surveys space token
 * @param sessionId - Session ID to save progress for
 * @param progressorData - Progress data to save
 * @returns True if save was successful, false otherwise
 */
export const saveProgressor = async (
  accountToken: string,
  sessionId: string,
  progressorData: ProgressorData
): Promise<boolean> => {
  const url = `${API_CONFIG.PLAYPEN_BASE_URL}${API_CONFIG.ENDPOINTS.PROGRESSOR_SAVE}`;
  const headers = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  };
  const body = JSON.stringify({
    sessionId,
    accountToken,
    data: progressorData,
  });

  try {
    const response = await fetch(url, {
      keepalive: true,
      method: 'POST',
      headers: headers,
      body: body,
    });

    if (!response.ok) {
      console.error(
        '=======Error=====>',
        new Error(`Usetiful: connection error ${response.status}`)
      );
      return false;
    }
    console.log('Usetiful: Progressor is updated!');
    return true;
  } catch (error: any) {
    console.error('=======Error=====>', error.message);
    return false;
  }
};
