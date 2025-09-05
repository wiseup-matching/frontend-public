import { useEffect, useState } from 'react';
import { defaultApi } from '../api/defaultapi.ts';
import type { JobPosting } from '@/api/openapi-client/models/JobPosting';

export const useJobPostings = () => {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    defaultApi
      .jobPostingGet()
      .then(setJobs)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { jobs, loading, error };
};
