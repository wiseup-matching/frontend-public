import { useEffect, useState } from 'react';
import { defaultApi } from '@/api/defaultapi';
import type { Cooperation } from '@/api/openapi-client';

export const useCooperations = () => {
  const [cooperations, setCooperations] = useState<Cooperation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    defaultApi
      .cooperationGet()
      .then((response) => {
        setCooperations(response);
      })
      .catch((err: unknown) => {
        console.error('Error fetching cooperations:', err);
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error('An unknown error occurred while fetching cooperations.'));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return { cooperations, loading, error };
};
