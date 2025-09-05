import React from 'react';
import type { CareerElement } from '@/api/openapi-client/models/CareerElement';
import { BriefcaseBusiness } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface RetireeExperienceSectionProps {
  careerElements: CareerElement[];
  isObscured?: boolean;
}

const RetireeExperienceSection: React.FC<RetireeExperienceSectionProps> = ({
  careerElements,
  isObscured,
}) => {
  const jobs = careerElements.filter((exp) => exp.kind === 'job');
  if (jobs.length === 0) return null;
  return (
    <div className="bg-background p-4 rounded-lg border border-border shadow-sm h-full">
      <h3 className="flex items-center text-lg font-semibold mb-3">
        <BriefcaseBusiness className="h-5 w-5 mr-2 text-primary" />
        Work Experience
      </h3>
      <ul className="space-y-2">
        {jobs.map((exp) => (
          <li key={exp.id} className="p-2 rounded border border-gray-200">
            <div className="text-gray-800">{exp.title}</div>
            <div className={`text-gray-800 text-sm ${isObscured ? 'blur-sm' : ''}`}>
              {exp.organizationName ?? ''}
            </div>
            <div className="text-gray-400 text-sm">
              {formatDate(exp.fromDate)}
              {exp.untilDate ? ` - ${formatDate(exp.untilDate)}` : ''}
            </div>
            <div className={`text-gray-800 text-sm mt-1${isObscured ? ' blur-sm' : ''}`}>
              {exp.description}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RetireeExperienceSection;
