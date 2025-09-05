import { useState, useEffect } from 'react';
import type { ExpertiseArea } from '@/api/openapi-client/models';
import { defaultApi } from '@/api/defaultapi';

export function useExpertiseAreas() {
  const [expertiseAreas, setExpertiseAreas] = useState<ExpertiseArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    defaultApi
      .expertiseAreaGet()
      .then((data) => setExpertiseAreas(data))
      .catch((e: unknown) => {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError('An unknown error occurred');
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return { expertiseAreas, loading, error };
}
