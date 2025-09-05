import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import type { JobPosting } from '@/api/openapi-client/models';

interface StartupJobPostingsProps {
  jobPostings: JobPosting[];
}

function formatDate(dateString?: string | Date | null) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getFullYear())}`;
}

const StartupJobPostings: React.FC<StartupJobPostingsProps> = ({ jobPostings }) => {
  const navigate = useNavigate();

  if (jobPostings.length === 0) {
    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Open Job Postings</h3>
        <p className="text-gray-500">This startup currently has no open job postings.</p>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">Open Job Postings</h3>
      <ul className="divide-y">
        {jobPostings.map((job) => (
          <li key={job.id} className="mb-4 border-b pb-2">
            <div className="font-medium text-l">{job.title}</div>
            <div className="text-gray-800 text-sm mb-1">
              {job.description?.split(' ').slice(0, 20).join(' ')} {'...'}
            </div>
            <div className="text-xs text-gray-400">
              Start: {formatDate(job.desiredStartDate)} | {job.approxHoursPerWeek}h/week
            </div>
            <div className="flex items-end mt-1">
              <Button
                size="sm"
                variant="outline"
                className="mt-1 bg-white border-primary text-primary text-xs hover:primary"
                onClick={() => void navigate(`/job/${job.id}`)}
              >
                <Eye className="h-1 w-1" /> View Details
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StartupJobPostings;
