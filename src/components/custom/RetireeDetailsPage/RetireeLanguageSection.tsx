import React from 'react';
import { Languages } from 'lucide-react';
import type { LanguageProficiency } from '@/api/openapi-client/models/LanguageProficiency';
import { Badge } from '@/components/ui/badge';

interface RetireeLanguageSectionProps {
  languageProficiencies: LanguageProficiency[];
  getLanguageName: (id: string) => string;
  getLevelName: (id: string) => string;
}

const RetireeLanguageSection: React.FC<RetireeLanguageSectionProps> = ({
  languageProficiencies,
  getLanguageName,
  getLevelName,
}) => {
  if (languageProficiencies.length === 0) {
    return (
      <div className="mb-6">
        <h3 className="flex items-center text-lg font-semibold mb-2">
          <Languages className="h-5 w-5 mr-2 text-primary" />
          Languages
        </h3>
        <div className="flex items-start py-2">
          <p className="text-foreground text-gray-500">
            No specific languages provided by this retiree.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h3 className="flex items-center text-lg font-semibold mb-2">
        <Languages className="h-5 w-5 mr-2 text-primary" />
        Languages
      </h3>
      <ul className="flex flex-wrap gap-2">
        {languageProficiencies.map((proficiency: LanguageProficiency) => (
          <Badge
            key={`lang-${proficiency.id}`}
            variant="outline"
            className="bg-background text-foreground px-3 py-1 rounded-full text-sm"
          >
            {getLanguageName(proficiency.languageId)} ({getLevelName(proficiency.levelId)})
          </Badge>
        ))}
      </ul>
    </div>
  );
};

export default RetireeLanguageSection;
