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
  const reqUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DATA}?lang=${API_CONFIG.DEFAULT_PARAMS.lang}&app=${API_CONFIG.DEFAULT_PARAMS.app}`;
  try {
    const response = await fetch(reqUrl, {
      method: 'GET',
      headers: {
        'X-Auth-Token': token,
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
 * @param token - Authentication token
 * @param userId - User ID to fetch progress for
 * @returns Progress data or null on error
 */
export const fetchProgressor = async (
  token: string,
  userId: string
): Promise<ProgressorData | null> => {
  const url = API_CONFIG.PROGRESSOR_URL;
  const headers = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  };
  const body = JSON.stringify({
    userId,
    accountToken: token,
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

    let tours = [];
    if (result.tours) {
      try {
        tours = JSON.parse(result.tours);
      } catch {
        console.warn("Warning: 'tours' key is not a valid JSON string.");
      }
    } else {
      console.warn("Warning: 'tours' key not found in response.");
    }

    const autoSegment = result.autoSegment;
    const storedAt = result.storedAt;
    const customSegments = result.customSegments;
    const uf_completed = result.uf_completed;

    return {
      tours,
      autoSegment,
      customSegments,
      storedAt,
      uf_completed,
    } as ProgressorData;
  } catch (error: any) {
    console.error('=======Error=====>', error.message);
    return null;
  }
};

/**
 * Saves user progress data to the Progressor API
 * @param token - Authentication token
 * @param userId - User ID to save progress for
 * @param progressorData - Progress data to save
 * @returns True if save was successful, false otherwise
 */
export const saveProgressor = async (
  token: string,
  userId: string,
  progressorData: ProgressorData
): Promise<boolean> => {
  const url = API_CONFIG.PROGRESSOR_SAVE_URL;
  const headers = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'X-AUTH-TOKEN': token,
  };
  const body = JSON.stringify({
    userId,
    accountToken: token,
    data: { ...progressorData },
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
