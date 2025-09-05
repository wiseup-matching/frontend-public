import useSWR from 'swr';
import { defaultApi } from '@/api/defaultapi';
import type { Startup } from '@/api/openapi-client/models/Startup';
import { useEffect, useState } from 'react';

// one tiny fetcher so SWR knows how to load the data
const fetchStartup = (id: string) => defaultApi.startupStartupIdGet({ startupId: id });

export function useStartup(id?: string) {
  const key = id ? (['/startup', id] as const) : null;

  const {
    data,
    error,
    isLoading,
    mutate, // SWR built-in cache setter
  } = useSWR<Startup>(key, ([_path, startupId]) => fetchStartup(startupId as string), {
    revalidateOnFocus: false,
  });

  // Force revalidate from the server
  const refreshStartup = () => mutate();

  return {
    startup: data,
    loading: isLoading,
    error,
    refreshStartup,
    mutateStartup: mutate,
  };
}

export function useStartups() {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    defaultApi
      .startupGet()
      .then((data) => setStartups(data))
      .catch((e: unknown) => {
        if (e instanceof Error) setError(e.message);
        else setError('An unknown error occurred');
      })
      .finally(() => setLoading(false));
  }, []);

  // map for quick access
  const startupMap = startups.reduce<Record<string, Startup>>((acc, s) => {
    acc[s.id] = s;
    return acc;
  }, {});

  return { startups, startupMap, loading, error };
}
