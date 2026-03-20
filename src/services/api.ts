import type {
  ProgressorData,
  SurveyReporterAnswer,
  GuidesAndSurveysResponse,
} from '../types';
import type { Environment } from '../constants/api';
import { API_CONFIG, getBaseUrl } from '../constants/api';

export interface GuidesAndSurveysApi {
  fetchDataJson: (token: string) => Promise<GuidesAndSurveysResponse | null>;
  fetchProgressor: (
    accountToken: string,
    sessionId: string
  ) => Promise<ProgressorData | null>;
  saveProgressor: (
    accountToken: string,
    sessionId: string,
    progressorData: ProgressorData
  ) => Promise<boolean>;
  postSurveyResponse: (
    accountToken: string,
    surveyId: string,
    payload: SurveyReporterAnswer[]
  ) => Promise<boolean>;
}

/**
 * Network client for Guides & Surveys APIs, bound to a single environment (base URL).
 */
export function createGuidesApi(environment: Environment): GuidesAndSurveysApi {
  const baseUrl = getBaseUrl(environment);

  return {
    async fetchDataJson(
      token: string
    ): Promise<GuidesAndSurveysResponse | null> {
      const reqUrl = `${baseUrl}${API_CONFIG.ENDPOINTS.DATA}?lang=${API_CONFIG.DEFAULT_PARAMS.lang}&app=${API_CONFIG.DEFAULT_PARAMS.app}`;
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
          console.error(
            `GuidesAndSurveys HTTP ERROR - status: ${response.status}`
          );
          return null;
        }

        const res: GuidesAndSurveysResponse = await response.json();
        console.log(`GuidesAndSurveys: data loaded`);
        return res;
      } catch (error: any) {
        console.error('=====error====>', error.message);
        return null;
      }
    },

    async fetchProgressor(
      accountToken: string,
      sessionId: string
    ): Promise<ProgressorData | null> {
      const url = `${baseUrl}${API_CONFIG.ENDPOINTS.PROGRESSOR_GET}`;
      const headers = {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      };
      const body = JSON.stringify({ sessionId, accountToken });

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers,
          body,
        });

        if (!response.ok) {
          console.error(
            '=======Error=====>',
            new Error(`GuidesAndSurveys: connection error ${response.status}`)
          );
          return null;
        }

        const result = await response.json();
        return typeof result === 'string' ? JSON.parse(result) : result;
      } catch (error: any) {
        console.error('=======Error=====>', error.message);
        return null;
      }
    },

    async saveProgressor(
      accountToken: string,
      sessionId: string,
      progressorData: ProgressorData
    ): Promise<boolean> {
      const url = `${baseUrl}${API_CONFIG.ENDPOINTS.PROGRESSOR_SAVE}`;
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
          headers,
          body,
        });

        if (!response.ok) {
          console.error(
            '=======Error=====>',
            new Error(`GuidesAndSurveys: connection error ${response.status}`)
          );
          return false;
        }
        console.log('GuidesAndSurveys: Progressor is updated!');
        return true;
      } catch (error: any) {
        console.error('=======Error=====>', error.message);
        return false;
      }
    },

    async postSurveyResponse(
      accountToken: string,
      surveyId: string,
      payload: SurveyReporterAnswer[]
    ): Promise<boolean> {
      const url = `${baseUrl}${API_CONFIG.ENDPOINTS.SURVEY_RESPONSES}/${surveyId}/responses/`;
      const headers = {
        'Content-Type': 'application/json; charset=utf-8',
        'x-auth-token': accountToken,
      };
      const body = JSON.stringify(payload);

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers,
          body,
        });

        if (!response.ok) {
          console.error(
            'GuidesAndSurveys: reporter survey response error',
            response.status
          );
          return false;
        }

        console.log(
          'GuidesAndSurveys: reporter survey response is sent:',
          response.status,
          body
        );
        return true;
      } catch (error: any) {
        console.error(
          'GuidesAndSurveys: reporter survey response error',
          error?.message
        );
        return false;
      }
    },
  };
}
