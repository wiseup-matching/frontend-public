import { useState, useEffect } from 'react';
import type { LanguageProficiencyLevel } from '@/api/openapi-client/models';
import { defaultApi } from '@/api/defaultapi';

export function useLanguageProficiencyLevels() {
  const [languageProficiencyLevels, setLanguageProficiencyLevels] = useState<
    LanguageProficiencyLevel[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    defaultApi
      .languageProficiencyLevelGet()
      .then((data) => setLanguageProficiencyLevels(data))
      .catch((e: unknown) => {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError('An unknown error occurred');
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return { languageProficiencyLevels, loading, error };
}
