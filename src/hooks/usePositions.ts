import { useState, useEffect } from 'react';
import type { Position } from '@/api/openapi-client/models';
import { defaultApi } from '@/api/defaultapi';

export function usePositions() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    defaultApi
      .positionGet()
      .then((data) => {
        setPositions(data);
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

  return { positions, loading, error };
}
