import React from 'react';
import { GraduationCap } from 'lucide-react';
import type { Degree } from '@/api/openapi-client/models';

interface DegreesSectionProps {
  degreeIds: string[];
  degrees: Degree[];
}

const DegreesSection: React.FC<DegreesSectionProps> = ({ degreeIds, degrees }) => {
  if (degreeIds.length === 0) {
    return (
      <div className="bg-background p-4 rounded-lg border border-border shadow-sm h-full">
        <h2 className="flex items-center text-lg font-semibold mb-3">
          <GraduationCap className="h-5 w-5 mr-2 text-primary" />
          Educational Requirements
        </h2>
        <div className="flex items-start py-2">
          <p className="text-foreground text-gray-500">
            No specific educational qualifications required.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background p-4 rounded-lg border border-border shadow-sm h-full">
      <h2 className="flex items-center text-lg font-semibold mb-3">
        <GraduationCap className="h-5 w-5 mr-2 text-primary" />
        Educational Requirements
      </h2>
      <ul className="space-y-2">
        {degreeIds.map((degreeId) => {
          const degree = degrees.find((d) => d.id === degreeId);
          return (
            <li
              key={`degree-${degreeId}`}
              className="flex items-center rounded p-3 transition-all border border-border"
            >
              <span className="text-foreground">{degree ? degree.title : degreeId}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default DegreesSection;
