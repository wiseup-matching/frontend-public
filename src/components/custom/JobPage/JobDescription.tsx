import React from 'react';

interface JobDescriptionProps {
  description: string | null | undefined;
}

const JobDescription: React.FC<JobDescriptionProps> = ({ description }) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">Job Description</h3>
      <p className="whitespace-pre-line text-foreground">{description}</p>
    </div>
  );
};

export default JobDescription;
