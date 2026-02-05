import { useEffect, useRef } from 'react';
import { useDataStore } from '../stores/useDataStore';
import { saveProgressor } from '../services/api';

export const useProgressorUpdate = () => {
  const progressorData = useDataStore((s) => s.progressorData);
  const progressorHasChanged = useDataStore((s) => s.progressorHasChanged);
  const token = useDataStore((s) => s.token);
  const tags = useDataStore((s) => s.tags);
  const setProgressorHasChanged = useDataStore(
    (s) => s.setProgressorHasChanged
  );
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(async () => {
      if (progressorData && progressorHasChanged && token && tags?.userId) {
        const isProgressorUpdated = await saveProgressor(
          token,
          tags.userId,
          progressorData
        );
        if (isProgressorUpdated) {
          setProgressorHasChanged(false);
        }
      }
    }, 2000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [
    progressorData,
    progressorHasChanged,
    setProgressorHasChanged,
    tags?.userId,
    token,
  ]);
};
