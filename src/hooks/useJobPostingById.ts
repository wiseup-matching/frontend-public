import { useEffect, useState } from 'react';
import { defaultApi } from '../api/defaultapi.ts';
import type { JobPosting } from '@/api/openapi-client/models/JobPosting';

export const useJobPostingById = (id: string | undefined) => {
  const [job, setJob] = useState<JobPosting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchJobPosting = async () => {
      try {
        const job = await defaultApi.jobPostingJobPostingIdGet({ jobPostingId: id });

        setJob(job);
      } catch (err) {
        console.error('Error fetching job:', err);
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setLoading(false);
      }
    };

    void fetchJobPosting();
  }, [id]);

  return { job, loading, error };
};
