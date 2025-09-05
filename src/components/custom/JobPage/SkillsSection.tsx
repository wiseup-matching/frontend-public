import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Wrench } from 'lucide-react';
import type { Skill } from '@/api/openapi-client/models';

interface SkillsSectionProps {
  skillIds: string[];
  skills: Skill[];
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ skillIds, skills }) => {
  return (
    <div className="mb-6">
      <h3 className="flex items-center text-lg font-semibold mb-2">
        <Wrench className="h-5 w-5 mr-2 text-primary" />
        Required Skills
      </h3>
      <div className="flex flex-wrap gap-2">
        {skillIds.map((skillId: string) => {
          const skill = skills.find((s) => s.id === skillId);
          return (
            <Badge
              key={`skill-${skillId}`}
              variant="outline"
              className="bg-background text-foreground px-3 py-1 rounded-full text-sm"
            >
              {skill ? skill.name : skillId}
            </Badge>
          );
        })}
      </div>
    </div>
  );
};

export default SkillsSection;
