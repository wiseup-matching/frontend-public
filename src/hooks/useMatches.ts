import { useEffect, useState } from 'react';
import { defaultApi } from '../api/defaultapi.ts';
import type { Match } from '@/api/openapi-client/models/Match';

// Add an interface to help with typing the error object
interface ResponseErrorLike {
  name?: string;
  response?: {
    status?: number;
  };
  status?: number;
}

// Hook to fetch matches for a specific job posting
export const useJobPostingMatches = (jobPostingId?: string) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Reset error state when job posting changes
    setError(null);

    // Only fetch if jobPostingId is provided
    if (!jobPostingId) {
      setMatches([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Use try/catch with async/await for clearer error handling
    (async () => {
      try {
        const data = await defaultApi.jobPostingJobPostingIdMatchesGet({ jobPostingId });

        // Ensure we're always working with an array
        const matchesArray = Array.isArray(data) ? data : [];

        setMatches(matchesArray);
      } catch (unknownErr: unknown) {
        // Type assertion to make TypeScript happy
        const err = unknownErr as ResponseErrorLike | null;

        // Determine if we received an OpenAPI ResponseError
        const errorText = JSON.stringify(err ?? {});
        const isResponseError =
          err?.name === 'ResponseError' || errorText.includes('ResponseError');

        // For no matches case - treat as normal
        if (isResponseError) {
          // Safely access status with optional chaining
          const status = err?.response?.status ?? err?.status;
          if (status === 404) {
            setMatches([]);
            setError(null);
            return;
          }
        }

        // For all other errors
        setError(new Error('Failed to fetch matches for job posting'));
      } finally {
        setLoading(false);
      }
    })();
  }, [jobPostingId]);

  return { matches, loading, error };
};
