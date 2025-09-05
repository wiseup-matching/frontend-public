import React from 'react';
import type { JobPosting } from '@/api/openapi-client/models/JobPosting';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import { defaultApi } from '@/api/defaultapi';

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
    <Card>
      <CardHeader className="flex items-center gap-2">
        {headerIcon}
        <CardTitle className="text-primary text-2xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {jobPostings.length === 0 ? (
          <p className="p-4 text-muted-foreground ml-2">No {title.toLowerCase()} available.</p>
        ) : (
          <ul className="divide-y">
            {jobPostings.map((job) => (
              <li key={job.id}>
                <JobPostingCard
                  job={job}
                  clickablePostings={clickablePostings}
                  selectedJobId={selectedJobId}
                  onJobClick={onJobClick}
                />
              </li>
            ))}
          </ul>
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
  const navigate = useNavigate();

  return (
    <div
      key={job.id}
      className={`p-4 ${clickablePostings ? 'cursor-pointer hover:bg-muted/50' : ''} ${
        selectedJobId === job.id ? 'bg-primary/10 border-l-4 border-primary' : ''
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

      <div className="mt-4 flex w-full overflow-hidden pl-2">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center flex-1 min-w-0 mr-2 bg-white"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/job/${job.id}`);
          }}
        >
          <Eye className="h-4 w-4 flex-shrink-0" />
          <span className="ml-2 overflow-hidden text-ellipsis whitespace-nowrap">View Details</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center flex-1 min-w-0 mr-2 bg-white"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/startup/edit-job/${job.id}`);
          }}
        >
          <Pencil className="h-4 w-4 flex-shrink-0" />
          <span className="ml-2 overflow-hidden text-ellipsis whitespace-nowrap">Edit Job</span>
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex items-center hover:bg-red-500 bg-white"
          onClick={(e) => {
            e.stopPropagation();
            toast('Are you sure you want to delete this job posting?', {
              action: (
                <div className="flex items-center gap-2">
                  <Button
                    className="hover:bg-red-500 bg-white"
                    variant="outline"
                    onClick={() => {
                      void (async () => {
                        try {
                          await defaultApi.jobPostingJobPostingIdDelete({ jobPostingId: job.id });
                          toast.success('Job deleted successfully');
                          window.location.reload();
                        } catch {
                          toast.error('Failed to delete job');
                        }
                      })();
                    }}
                  >
                    Delete
                  </Button>
                  <X
                    className="h-5 w-5 cursor-pointer hover:text-red-500"
                    onClick={() => toast.dismiss()}
                  />
                </div>
              ),
            });
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default JobPostingsSection;
