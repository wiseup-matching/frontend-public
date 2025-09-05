import { useEffect, useState } from 'react';
import { defaultApi } from '../api/defaultapi.ts';
import type { JobPosting } from '@/api/openapi-client/models/JobPosting';

interface UseStartupJobPostingsResult {
  jobs: JobPosting[];
  loading: boolean;
  error: Error | null;
}

export const useStartupJobPostings = (startupId?: string): UseStartupJobPostingsResult => {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!startupId) {
      setJobs([]);
      setLoading(false);
      return;
    }

    defaultApi
      .jobPostingGet()
      .then((allJobs) => {
        const startupJobs = allJobs.filter((job) => job.startupId === startupId);
        setJobs(startupJobs);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, [startupId]);

  return { jobs, loading, error };
};
