import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useRetireeStatistics } from '@/hooks/useRetireeStatistics';
import type { Retiree } from '@/api/openapi-client/models/Retiree.ts';

interface StatisticsSectionProps {
  retiree: Retiree;
}

const StatisticsSection: React.FC<StatisticsSectionProps> = ({ retiree }) => {
  const { statistics, loading, error } = useRetireeStatistics(retiree);

  if (loading) {
    return (
      <Card>
        <CardContent>
          <div className="text-center text-gray-500">Loading statistics...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <div className="text-center text-red-500">Error loading statistics</div>
        </CardContent>
      </Card>
    );
  }

  const formatMemberSince = (date: Date) => {
    return date.getFullYear().toString();
  };

  return (
    <Card>
      <CardContent className="bg-gray-50">
        <div className="grid grid-cols-2 gap-4">
          {/* startups suppported */}
          <div>
            <div className="text-primary text-sm font-medium mb-1">Startups Supported</div>
            <div className="font-medium text-black">{statistics.startupsSupported}</div>
          </div>

          {/* connections made */}
          <div>
            <div className="text-primary text-sm font-medium mb-1">Connections Made</div>
            <div className="font-medium text-black">{statistics.connectionsMade}</div>
          </div>

          {/* job requests received*/}
          <div>
            <div className="text-primary text-sm font-medium mb-1">Job Offers</div>
            <div className="font-medium text-black">{statistics.jobOffersReceived}</div>
          </div>

          {/* member since */}
          <div>
            <div className="text-primary text-sm font-medium mb-1">Member Since</div>
            <div className="font-medium text-black">
              {statistics.memberSince ? formatMemberSince(statistics.memberSince) : 'N/A'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatisticsSection;
