import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Target } from 'lucide-react';
import type { ExpertiseArea } from '@/api/openapi-client/models';

interface ExpertiseSectionProps {
  expertiseIds: string[];
  expertiseAreas: ExpertiseArea[];
}

const ExpertiseSection: React.FC<ExpertiseSectionProps> = ({ expertiseIds, expertiseAreas }) => {
  return (
    <div className="mb-6">
      <h3 className="flex items-center text-lg font-semibold mb-2">
        <Target className="h-5 w-5 mr-2 text-primary" />
        Expertise Areas
      </h3>
      <div className="flex flex-wrap gap-2">
        {expertiseIds.map((expertiseId: string) => {
          const expertise = expertiseAreas.find((e) => e.id === expertiseId);
          return (
            <Badge
              key={`expertise-${expertiseId}`}
              variant="outline"
              className="bg-background text-foreground px-3 py-1 rounded-full text-sm"
            >
              {expertise ? expertise.name : expertiseId}
            </Badge>
          );
        })}
      </div>
    </div>
  );
};

export default ExpertiseSection;
