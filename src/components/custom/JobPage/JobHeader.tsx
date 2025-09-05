import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import type { JobPostingSubscriptionTierEnum, Startup } from '@/api/openapi-client/models';
import { SubscriptionTierBadge } from '../subscription-tier-badge';

interface JobHeaderProps {
  title: string;
  startup?: Startup;
  subscriptionTier?: JobPostingSubscriptionTierEnum;
}

const JobHeader: React.FC<JobHeaderProps> = ({ title, startup, subscriptionTier }) => {
  const navigate = useNavigate();

  const handleStartupClick = () => {
    if (startup?.id) {
      navigate(`/startup/public/${startup.id}`);
    }
  };

  return (
    <div>
      <CardHeader className="border-b pb-3 pt-3">
        <CardTitle className="text-2xl font-bold text-primary flex flex-row justify-between w-full">
          <div>{title}</div>
          <SubscriptionTierBadge tier={subscriptionTier} minimal={false} />
        </CardTitle>
        <CardDescription className="text-foreground mt-1 text-base">
          Posted by{' '}
          {startup?.id ? (
            <button
              type="button"
              onClick={handleStartupClick}
              className="text-primary hover:text-primary/80 hover:underline cursor-pointer font-medium"
            >
              {startup.title}
            </button>
          ) : (
            startup?.title
          )}
        </CardDescription>
      </CardHeader>
    </div>
  );
};

export default JobHeader;
