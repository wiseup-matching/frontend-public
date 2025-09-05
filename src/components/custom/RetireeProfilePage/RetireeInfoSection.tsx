import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Retiree } from '@/api/openapi-client/models';
import { formatDate } from '@/lib/utils';

interface RetireeInfoSectionProps {
  retiree: Retiree;
}

const RetireeInfoSection: React.FC<RetireeInfoSectionProps> = ({ retiree }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-primary">Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <strong>Email:</strong> {retiree.email}
        </div>
        <div>
          <strong>Retired Since:</strong> {formatDate(retiree.retiredSince)}
        </div>
        <div>
          <strong>Hourly Salary:</strong> {retiree.expectedHourlySalaryEUR ?? 'N/A'} €
        </div>
        <div>
          <strong>Availability:</strong> {retiree.desiredWorkHoursPerWeek ?? 'N/A'} h/week
        </div>
        <div>
          <strong>Address:</strong> {retiree.addressStreet}, {retiree.addressZip}{' '}
          {retiree.addressCity}, {retiree.addressCountry}
        </div>
        <div>
          <strong>Birthday:</strong> {formatDate(retiree.birthday)}
        </div>
      </CardContent>
    </Card>
  );
};

export default RetireeInfoSection;
