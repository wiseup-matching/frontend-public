import { useState, useEffect } from 'react';
import { defaultApi } from '@/api/defaultapi';
import { useAuth } from '@/context/AuthContext';
import type { JobPosting } from '@/api/openapi-client';
import { useStartups } from './useStartup';

export const useCategorizedJobPostings = (startupIdParam?: string) => {
  const [openJobPostings, setOpenJobPostings] = useState<JobPosting[]>([]);
  const [hiredJobPostings, setHiredJobPostings] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { user, loading: userLoading } = useAuth();
  const startupId = startupIdParam ?? user?.id;

  useEffect(() => {
    if (userLoading && !startupId) return;
    if (!startupId) {
      setLoading(false);
      return;
    }

    Promise.all([defaultApi.jobPostingGet(), defaultApi.cooperationGet()])
      .then(([allJobPostings, cooperations]) => {
        const myJobPostings = allJobPostings.filter((job) => job.startupId === startupId);

        const hiredJobPostingIds = cooperations
          .filter((coop) => coop.status === 'accepted')
          .map((coop) => coop.jobPostingId);

        const open: JobPosting[] = [];
        const hired: JobPosting[] = [];

        myJobPostings.forEach((job) => {
          if (hiredJobPostingIds.includes(job.id)) {
            hired.push(job);
          } else {
            open.push(job);
          }
        });

        setOpenJobPostings(open);
        setHiredJobPostings(hired);
      })
      .catch((err: unknown) => {
        console.error('Error fetching job postings or cooperations:', err);
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error('An unknown error occurred while fetching data.'));
        }
      })
      .finally(() => setLoading(false));
  }, [startupId, userLoading]);

  return { openJobPostings, hiredJobPostings, loading, error, startupId, userLoading };
};

export const useAllOpenJobPostings = () => {
  const [openJobPostings, setOpenJobPostings] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { startupMap, loading: loadingStartups } = useStartups();
  const { user } = useAuth();

  useEffect(() => {
    if (loadingStartups || !user) return;

    Promise.all([defaultApi.jobPostingGet(), defaultApi.cooperationGet()])
      .then(([allJobPostings, cooperations]) => {
        const hiredJobPostingIds = cooperations
          .filter((coop) => coop.status === 'accepted')
          .map((coop) => coop.jobPostingId);

        const openJobs = allJobPostings.filter((job) => !hiredJobPostingIds.includes(job.id));

        setOpenJobPostings(openJobs);
      })
      .catch((err: unknown) => {
        console.error('Error fetching job postings or cooperations:', err);
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error('An unknown error occurred while fetching data.'));
        }
      })
      .finally(() => setLoading(false));
  }, [loadingStartups, user]);

  return { openJobPostings, loading, error, startupMap };
};
