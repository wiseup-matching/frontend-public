import { useState, useEffect } from 'react';
import type { Degree } from '@/api/openapi-client/models';
import { defaultApi } from '@/api/defaultapi';

export function useDegrees() {
  const [degrees, setDegrees] = useState<Degree[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    defaultApi
      .degreeGet()
      .then((data) => {
        setDegrees(data);
      })
      .catch((e: unknown) => {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError('An unknown error occurred');
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return { degrees, loading, error };
}
