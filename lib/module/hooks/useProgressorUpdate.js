"use strict";

import { useEffect, useRef } from 'react';
import { useStore } from "../stores/useStore.js";
export const useProgressorUpdate = () => {
  const progressorData = useStore(s => s.progressorData);
  const progressorHasChanged = useStore(s => s.progressorHasChanged);
  const token = useStore(s => s.token);
  const tags = useStore(s => s.tags);
  const setProgressorHasChanged = useStore(s => s.setProgressorHasChanged);
  const intervalRef = useRef(null);
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(async () => {
      if (progressorData && progressorHasChanged && token && tags?.userId) {
        const isProgressorUpdated = await saveProgressor(token, tags.userId, progressorData);
        if (isProgressorUpdated) {
          setProgressorHasChanged(false);
        }
      }
    }, 10000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [progressorData, progressorHasChanged, setProgressorHasChanged, tags?.userId, token]);
};
const saveProgressor = async (token, userId, progressorData) => {
  const url = 'https://progressor.usetiful.com/api/save';
  const headers = {
    'Content-Type': 'application/json',
    'x-requested-with': 'XMLHttpRequest',
    'X-AUTH-TOKEN': token
  };
  const body = JSON.stringify({
    userId,
    accountToken: token,
    data: {
      ...progressorData,
      tours: JSON.stringify(progressorData.tours)
    }
  });
  try {
    const response = await fetch(url, {
      keepalive: true,
      method: 'POST',
      headers: headers,
      body: body
    });
    if (!response.ok) {
      console.error('=======Error=====>', new Error(`Usetiful: connection error ${response.status}`));
      return false;
    }
    console.log('Usetiful: Progressor is updated!');
    return true;
  } catch (error) {
    console.error('=======Error=====>', error.message);
    return false;
  }
};
//# sourceMappingURL=useProgressorUpdate.js.map