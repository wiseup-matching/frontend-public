import React from 'react';
import { BriefcaseBusiness } from 'lucide-react';
import type { Position } from '@/api/openapi-client/models';

interface WorkExperienceSectionProps {
  positionIds?: string[];
  positions?: Position[];
}

const WorkExperienceSection: React.FC<WorkExperienceSectionProps> = ({
  positionIds,
  positions,
}) => {
  if ((positionIds?.length ?? 0) === 0) {
    return (
      <div className="bg-background p-4 rounded-lg border border-border shadow-sm h-full">
        <h2 className="flex items-center text-lg font-semibold mb-3">
          <BriefcaseBusiness className="h-5 w-5 mr-2 text-primary" />
          Required Work Experience
        </h2>
        <div className="flex items-start py-2">
          <p className="text-foreground text-gray-500">
            No specific positions required for this role.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background p-4 rounded-lg border border-border shadow-sm h-full">
      <h2 className="flex items-center text-lg font-semibold mb-3">
        <BriefcaseBusiness className="h-5 w-5 mr-2 text-primary" />
        Required Work Experience
      </h2>
      <ul className="space-y-2">
        {positionIds?.map((positionId) => {
          const position = positions?.find((p) => p.id === positionId);
          return (
            <li
              key={`position-${positionId}`}
              className="flex items-center rounded p-3 transition-all border border-border"
            >
              <span className="text-foreground">{position ? position.title : positionId}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default WorkExperienceSection;
