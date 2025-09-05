import React from 'react';
import { Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface RetireeExpertiseSectionProps {
  expertiseIds: string[];
  getExpertiseName: (id: string) => string;
}

const RetireeExpertiseSection: React.FC<RetireeExpertiseSectionProps> = ({
  expertiseIds,
  getExpertiseName,
}) => {
  if (expertiseIds.length === 0) {
    return (
      <div className="mb-6">
        <h3 className="flex items-center text-lg font-semibold mb-2">
          <Target className="h-5 w-5 mr-2 text-primary" />
          Expertise Areas
        </h3>
        <div className="flex items-start py-2">
          <p className="text-foreground text-gray-500">
            No specific expertise areas provided by this retiree.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h3 className="flex items-center text-lg font-semibold mb-2">
        <Target className="h-5 w-5 mr-2 text-primary" />
        Expertise Areas
      </h3>
      <ul className="flex flex-wrap gap-2">
        {expertiseIds.map((expertiseId) => (
          <Badge
            key={`expertise-${expertiseId}`}
            variant="outline"
            className="bg-background text-foreground px-3 py-1 rounded-full text-sm"
          >
            {getExpertiseName(expertiseId)}
          </Badge>
        ))}
      </ul>
    </div>
  );
};

export default RetireeExpertiseSection;
