import { useState, useEffect } from 'react';
import type { Language } from '@/api/openapi-client/models';
import { defaultApi } from '@/api/defaultapi';

export function useLanguages() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    defaultApi
      .languageGet()
      .then((data) => setLanguages(data))
      .catch((e: unknown) => {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError('An unknown error occurred');
        }
      })
      .finally(() => setLoading(false));
  }, []);
  return { languages, loading, error };
}
