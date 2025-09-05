import { useEffect, useState } from 'react';
import { defaultApi } from '@/api/defaultapi';
import type { Retiree } from '../api/openapi-client/models/Retiree.ts';

interface RetireeStatistics {
  startupsSupported: number;
  connectionsMade: number;
  jobOffersReceived: number;
  memberSince: Date | undefined;
}

export const useRetireeStatistics = (retiree: Retiree) => {
  const [statistics, setStatistics] = useState<RetireeStatistics>({
    startupsSupported: 0,
    connectionsMade: 0,
    jobOffersReceived: 0,
    memberSince: undefined,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        setError(null);

        const [cooperations, conversations] = await Promise.all([
          defaultApi.cooperationGet(),
          defaultApi.conversationGet(),
        ]);

        const retireeCooperations = cooperations.filter((coop) => coop.retireeId === retiree.id);

        // job offers received (all gotten cooperations)
        const jobOffersReceived = retireeCooperations.length;

        // startups supported
        const jobPostingToStartupMap = new Map<string, string>();

        const jobPostings = await defaultApi.jobPostingGet();
        jobPostings.forEach((jobPosting: { id: string; startupId: string }) => {
          jobPostingToStartupMap.set(jobPosting.id, jobPosting.startupId);
        });

        const startupsSupported = new Set(
          retireeCooperations
            .filter((coop) => coop.status === 'accepted')
            .map((coop) => jobPostingToStartupMap.get(coop.jobPostingId)),
        ).size;

        // connections made (conversations with retiree and unique startups)
        const retireeConversations = conversations.filter((conv) =>
          conv.participants.some((participant) => participant.id === retiree.id),
        );

        const uniqueStartupIds = new Set<string>();
        retireeConversations.forEach((conv) => {
          conv.participants.forEach((participant) => {
            if (participant.id !== retiree.id) {
              uniqueStartupIds.add(participant.id);
            }
          });
        });

        const connectionsMade = uniqueStartupIds.size;

        // member since via createdAt
        const memberSince: Date | undefined = retiree.createdAt;

        setStatistics({
          startupsSupported,
          connectionsMade,
          jobOffersReceived,
          memberSince,
        });
      } catch (err) {
        console.error('Error fetching retiree statistics:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch statistics'));
      } finally {
        setLoading(false);
      }
    };

    void fetchStatistics();
  }, [retiree]);

  return { statistics, loading, error };
};
