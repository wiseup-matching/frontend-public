import React from 'react';
import type { Retiree } from '@/api/openapi-client/models/Retiree';
import { MapPin, Calendar, Euro, Clock } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface RetireeDetailsSectionProps {
  retiree: Retiree;
  isObscured?: boolean;
}

const RetireeDetailsSection: React.FC<RetireeDetailsSectionProps> = ({ retiree }) => {
  return (
    <div className="bg-background p-4 rounded-lg border border-border shadow-sm">
      <h3 className="text-lg font-semibold mb-3">Retiree Details</h3>
      <ul className="space-y-3">
        <>
          <li className="flex items-center py-1">
            <MapPin className="h-5 w-5 mr-3 text-primary" />
            <span className="font-semibold">
              Address:{' '}
              <span className={'font-normal'}>
                {retiree.addressCity && retiree.addressCountry ? (
                  `${retiree.addressCity}, ${retiree.addressCountry}`
                ) : (
                  <span className="text-gray-500">Not provided</span>
                )}
              </span>
            </span>
          </li>
          <li className="flex items-center py-1">
            <Calendar className="h-5 w-5 mr-3 text-primary" />
            <span className="font-semibold">
              Retired Since:{' '}
              <span className="font-normal">
                {retiree.retiredSince ? (
                  formatDate(retiree.retiredSince)
                ) : (
                  <span className="text-gray-500">Not provided</span>
                )}
              </span>
            </span>
          </li>
          <li className="flex items-center py-1">
            <Euro className="h-5 w-5 mr-3 text-primary" />
            <span className="font-semibold">
              Expected Salary:{' '}
              <span className="font-normal">
                {retiree.expectedHourlySalaryEUR != null ? (
                  `€${String(retiree.expectedHourlySalaryEUR)} per hour`
                ) : (
                  <span className="text-gray-500">Not provided</span>
                )}
              </span>
            </span>
          </li>
          <li className="flex items-center py-1">
            <Clock className="h-5 w-5 mr-3 text-primary" />
            <span className="font-semibold">
              Desired Hours/Week:{' '}
              <span className="font-normal">
                {retiree.desiredWorkHoursPerWeek != null ? (
                  `${String(retiree.desiredWorkHoursPerWeek)} hours per week`
                ) : (
                  <span className="text-gray-500">Not provided</span>
                )}
              </span>
            </span>
          </li>
        </>
      </ul>
    </div>
  );
};

export default RetireeDetailsSection;
