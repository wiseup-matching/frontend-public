import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import type { Startup } from '@/api/openapi-client/models';
import { useFundingStatuses } from '@/hooks/useFundingStatus';

interface BusinessInfoSectionProps {
  startup: Startup;
}

const BusinessInfoSection: React.FC<BusinessInfoSectionProps> = ({ startup }) => {
  const { fundingStatuses, loading: fundingStatusLoading, error } = useFundingStatuses();

  if (fundingStatusLoading) {
    return <div>Loading funding statuses...</div>;
  }

  if (error) {
    return <div>Error loading funding statuses: {error}</div>;
  }

  const fundingStatus = fundingStatuses.find((fs) => fs.id === startup.fundingStatus);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-primary">Startup Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-x-6 text-primary text-base">
          <div className="col-span-1 font-bold">Industry</div>
          <div className="col-span-1 font-bold pl-8 truncate">Employees</div>
          <div className="col-span-1 text-gray-800">{startup.industry}</div>
          <div className="col-span-1 text-gray-800 pl-8">{startup.fulltimeEmployeesNum}</div>
          <div className="col-span-2 h-6" />

          <div className="col-span-1 font-bold">Location</div>
          <div className="col-span-1 font-bold pl-8">Founded</div>
          <div className="col-span-1 text-gray-800">
            {startup.addressCity}, {startup.addressCountry}
          </div>
          <div className="col-span-1 text-gray-800 pl-8">{startup.foundingYear}</div>
          <div className="col-span-2 h-6" />

          <div className="col-span-1 font-bold">Funding Status</div>
          <div className="col-span-1 font-bold pl-8 truncate">Revenue/year</div>
          <div className="col-span-1 text-gray-800">{fundingStatus?.title ?? 'N/A'}</div>
          <div className="col-span-1 text-gray-800 pl-8">
            {startup.revenuePerYearEUR?.toLocaleString('en-US', {
              style: 'currency',
              currency: 'EUR',
              maximumFractionDigits: 0,
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessInfoSection;
