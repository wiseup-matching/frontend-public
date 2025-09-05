import { useState, useEffect } from 'react';
import type { Skill } from '@/api/openapi-client/models';
import { defaultApi } from '@/api/defaultapi';

export function useSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    defaultApi
      .skillGet()
      .then((data) => {
        setSkills(data);
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

  return { skills, loading, error };
}
