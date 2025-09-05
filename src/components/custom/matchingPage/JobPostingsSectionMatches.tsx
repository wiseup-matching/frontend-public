// for job postings in matching interface (no edit buttons)

import React from 'react';
import type { JobPosting } from '@/api/openapi-client/models/JobPosting';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';

interface JobPostingsSectionProps {
  title: string;
  jobPostings: JobPosting[];
  clickablePostings?: boolean;
  onJobClick?: (job: JobPosting) => void;
  selectedJobId?: string;
  headerIcon?: React.ReactNode;
}

const JobPostingsSection: React.FC<JobPostingsSectionProps> = ({
  title,
  jobPostings,
  clickablePostings = false,
  onJobClick,
  selectedJobId,
  headerIcon,
}) => {
  return (
    <Card className="h-full bg-transparent">
      <CardHeader className="flex items-center gap-2">
        {headerIcon}
        <CardTitle className="text-primary text-2xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {jobPostings.length === 0 ? (
          <p className="p-4 text-muted-foreground ml-2">No {title.toLowerCase()} available.</p>
        ) : (
          <div className="divide-y">
            {jobPostings.map((job) => (
              <JobPostingCard
                key={job.id}
                job={job}
                clickablePostings={clickablePostings}
                selectedJobId={selectedJobId}
                onJobClick={onJobClick}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

function JobPostingCard({
  job,
  clickablePostings,
  selectedJobId,
  onJobClick,
}: {
  job: JobPosting;
  clickablePostings?: boolean;
  selectedJobId?: string;
  onJobClick?: (job: JobPosting) => void;
}) {
  return (
    <div
      key={job.id}
      className={`p-4 ${clickablePostings ? 'cursor-pointer hover:bg-muted/50 border-l-4' : ''} ${
        selectedJobId === job.id ? 'bg-primary/10 border-primary' : 'border-transparent'
      }`}
      onClick={clickablePostings && onJobClick ? () => onJobClick(job) : undefined}
    >
      <h3 className="text-xl font-bold mb-2 pl-2">{job.title}</h3>
      <p className="text-muted-foreground mb-4 pl-2">
        {(() => {
          const words = job.description?.split(' ') ?? [];
          const shortDesc = words.slice(0, 10).join(' ');
          return words.length > 20 ? `${shortDesc} ...` : shortDesc;
        })()}
      </p>
      <p className="text-sm text-muted-foreground pl-2">
        Start: {formatDate(job.desiredStartDate)} | {job.approxHoursPerWeek}h/week
      </p>
    </div>
  );
}

export default JobPostingsSection;
