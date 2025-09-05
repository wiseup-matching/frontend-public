import { useState, useEffect } from 'react';
import type { FundingStatus } from '@/api/openapi-client/models';
import { defaultApi } from '@/api/defaultapi';

export function useFundingStatuses() {
  const [fundingStatuses, setFundingStatuses] = useState<FundingStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    defaultApi
      .fundingStatusGet()
      .then((data) => {
        setFundingStatuses(data);
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

  return { fundingStatuses, loading, error };
}
