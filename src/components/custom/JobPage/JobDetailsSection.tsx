import React from 'react';
import { MapPin, Calendar, BriefcaseBusiness, Clock, Euro } from 'lucide-react';
import type { JobPosting } from '@/api/openapi-client/models';
import { formatDate } from '@/lib/utils';

interface JobDetailsSectionProps {
  job: JobPosting;
}

const JobDetailsSection: React.FC<JobDetailsSectionProps> = ({ job }) => {
  return (
    <div className="bg-background p-4 rounded-lg border border-border shadow-sm">
      <h3 className="text-lg font-semibold mb-3">Job Details</h3>
      <ul className="space-y-3">
        <li className="flex items-center py-1">
          <MapPin className="h-5 w-5 mr-3 text-primary" />
          <span className="font-semibold">
            Location:{' '}
            <span className="font-normal">
              {!job.requiredZip && !job.requiredCity && !job.requiredCountry
                ? 'Remote'
                : `${job.requiredCity ?? ''}, ${job.requiredCountry ?? ''}`}
            </span>
          </span>
        </li>

        <li className="flex items-center py-1">
          <Calendar className="h-5 w-5 mr-3 text-primary" />
          <span className="font-semibold">
            Start Date:{' '}
            <span className="font-normal">
              {job.desiredStartDate ? (
                formatDate(job.desiredStartDate)
              ) : (
                <span className="text-gray-500">Not provided</span>
              )}
            </span>
          </span>
        </li>

        <li className="flex items-center py-1">
          <BriefcaseBusiness className="h-5 w-5 mr-3 text-primary" />
          <span className="font-semibold">
            Duration:{' '}
            <span className="font-normal">
              {job.approxDurationWeeks != null ? (
                `Approx. ${job.approxDurationWeeks.toString()} weeks`
              ) : (
                <span className="text-gray-500">Not provided</span>
              )}
            </span>
          </span>
        </li>

        <li className="flex items-center py-1">
          <Clock className="h-5 w-5 mr-3 text-primary" />
          <span className="font-semibold">
            Hours:{' '}
            <span className="font-normal">
              {job.approxHoursPerWeek != null ? (
                `${job.approxHoursPerWeek.toString()} hours per week`
              ) : (
                <span className="text-gray-500">Not provided</span>
              )}
            </span>
          </span>
        </li>

        <li className="flex items-center py-1">
          <Calendar className="h-5 w-5 mr-3 text-primary" />
          <span className="font-semibold">
            Days:{' '}
            <span className="font-normal">
              {job.approxDaysPerWeek != null ? (
                `${job.approxDaysPerWeek.toString()} days per week`
              ) : (
                <span className="text-gray-500">Not provided</span>
              )}
            </span>
          </span>
        </li>

        <li className="flex items-center py-1">
          <Euro className="h-5 w-5 mr-3 text-primary" />
          <span className="font-semibold">
            Hourly Rate:{' '}
            <span className="font-medium">
              {job.approxHourlySalaryEUR != null ? (
                `€${job.approxHourlySalaryEUR.toString()} per hour`
              ) : (
                <span className="text-gray-500">Not provided</span>
              )}
            </span>
          </span>
        </li>
      </ul>
    </div>
  );
};

export default JobDetailsSection;
