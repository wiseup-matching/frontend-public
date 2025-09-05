import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Languages } from 'lucide-react';
import type {
  LanguageProficiency,
  Language,
  LanguageProficiencyLevel,
} from '@/api/openapi-client/models';

interface LanguageSectionProps {
  languageProficiencies: LanguageProficiency[];
  languages: Language[];
  languageProficiencyLevels: LanguageProficiencyLevel[];
}

const LanguageSection: React.FC<LanguageSectionProps> = ({
  languageProficiencies,
  languages,
  languageProficiencyLevels,
}) => {
  if (languageProficiencies.length === 0) {
    return (
      <div className="mb-6">
        <h3 className="flex items-center text-lg font-semibold mb-2">
          <Languages className="h-5 w-5 mr-2 text-primary" />
          Language Requirements
        </h3>
        <div className="flex items-start py-2">
          <p className="text-foreground text-gray-500">
            No specific languages required for this role.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="mb-6">
      <h3 className="flex items-center text-lg font-semibold mb-2">
        <Languages className="h-5 w-5 mr-2 text-primary" />
        Language Requirements
      </h3>
      <div className="flex flex-wrap gap-2">
        {languageProficiencies.map((proficiency: LanguageProficiency) => {
          const language = languages.find((l) => l.id === proficiency.languageId);
          const level = languageProficiencyLevels.find((l) => l.id === proficiency.levelId);
          return (
            <Badge
              key={`lang-${proficiency.id}`}
              variant="outline"
              className="bg-background text-foreground px-3 py-1 rounded-full text-sm"
            >
              {language?.name ?? 'Unknown Language'} ({level?.code ?? 'Unknown Level'})
            </Badge>
          );
        })}
      </div>
    </div>
  );
};

export default LanguageSection;
