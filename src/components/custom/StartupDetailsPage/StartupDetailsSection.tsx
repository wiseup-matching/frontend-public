import React from 'react';
import { MapPin, Calendar, Users, BarChart3, Globe, Scale } from 'lucide-react';
import type { Startup } from '@/api/openapi-client/models';
import { useFundingStatuses } from '@/hooks/useFundingStatus';

interface StartupDetailsSectionProps {
  startup: Startup;
}

const StartupDetailsSection: React.FC<StartupDetailsSectionProps> = ({ startup }) => {
  const { fundingStatuses, loading: fundingStatusLoading, error } = useFundingStatuses();

  if (fundingStatusLoading) {
    return <div>Loading funding statuses...</div>;
  }

  if (error) {
    return <div>Error loading funding statuses: {error}</div>;
  }

  const fundingStatus = fundingStatuses.find((fs) => fs.id === startup.fundingStatus);

  const websiteUrl = startup.websiteUrl?.includes('http')
    ? startup.websiteUrl
    : `https://${startup.websiteUrl ?? ''}`;
  const imprintUrl = startup.imprintUrl?.includes('http')
    ? startup.imprintUrl
    : `https://${startup.imprintUrl ?? ''}`;

  return (
    <div className="bg-background p-4 rounded-lg border border-border shadow-sm">
      <h3 className="text-lg font-semibold mb-3">Startup Details</h3>
      <ul className="space-y-3">
        <li className="flex items-center py-1">
          <MapPin className="h-5 w-5 mr-3 text-primary" />
          <span className="font-semibold">
            Location:{' '}
            <span className="font-normal">
              {startup.addressCity}, {startup.addressCountry}
            </span>
          </span>
        </li>

        <li className="flex items-center py-1">
          <Calendar className="h-5 w-5 mr-3 text-primary" />
          <span className="font-semibold">
            Founded: <span className="font-normal">{startup.foundingYear}</span>
          </span>
        </li>

        <li className="flex items-center py-1">
          <Users className="h-5 w-5 mr-3 text-primary" />
          <span className="font-semibold">
            Team Size: <span className="font-normal">{startup.fulltimeEmployeesNum} employees</span>
          </span>
        </li>

        <li className="flex items-center py-1">
          <BarChart3 className="h-5 w-5 mr-3 text-primary" />
          <span className="font-semibold">
            Funding Status: <span className="font-normal">{fundingStatus?.title ?? 'N/A'}</span>
          </span>
        </li>

        <li className="flex items-center py-1">
          <Globe className="h-5 w-5 mr-3 text-primary" />
          <span className="font-semibold">
            Website:{' '}
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-normal text-primary hover:underline"
            >
              {startup.websiteUrl}
            </a>
          </span>
        </li>
        <li className="flex items-center py-1">
          <Scale className="h-5 w-5 mr-3 text-primary" />
          <span className="font-semibold">
            Imprint:{' '}
            <a
              href={imprintUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-normal text-primary hover:underline"
            >
              {startup.imprintUrl}
            </a>
          </span>
        </li>
      </ul>
    </div>
  );
};

export default StartupDetailsSection;
