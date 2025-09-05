import React from 'react';
import { Wrench } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface RetireeSkillsSectionProps {
  skills: string[];
  getSkillName: (id: string) => string;
}

const RetireeSkillsSection: React.FC<RetireeSkillsSectionProps> = ({ skills, getSkillName }) => {
  if (skills.length === 0) {
    return (
      <div className="mb-6">
        <h3 className="flex items-center text-lg font-semibold mb-2">
          <Wrench className="h-5 w-5 mr-2 text-primary" />
          Skills
        </h3>
        <div className="flex items-start py-2">
          <p className="text-foreground text-gray-500">
            No specific skills provided by this retiree.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h3 className="flex items-center text-lg font-semibold mb-2">
        <Wrench className="h-5 w-5 mr-2 text-primary" />
        Skills
      </h3>
      <ul className="flex flex-wrap gap-2">
        {skills.map((skillId) => (
          <Badge
            key={`skill-${skillId}`}
            variant="outline"
            className="bg-background text-foreground px-3 py-1 rounded-full text-sm"
          >
            {getSkillName(skillId)}
          </Badge>
        ))}
      </ul>
    </div>
  );
};

export default RetireeSkillsSection;
