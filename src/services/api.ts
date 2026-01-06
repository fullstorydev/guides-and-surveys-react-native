import type { Tour, UsetifulResponse, ProgressorData } from '../types';
import { API_CONFIG } from '../constants/api';

/**
 * Fetches tour data from the Usetiful API
 * @param token - Authentication token
 * @returns Array of tours or empty array on error
 */
export const fetchDataJson = async (token: string): Promise<Tour[]> => {
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
      return [];
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

    return res.tours;
  } catch (error: any) {
    console.error('=====error====>', error.message);
    return [];
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
    // Bug fix: response.json() already parses JSON, no need for JSON.parse()
    const result = await response.json();

    let tours = [];
    if (result.tours) {
      try {
        tours = JSON.parse(result.tours);
      } catch (error) {
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
