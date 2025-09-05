import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import RetireeHeaderMatches from '@/components/custom/matchingPage/RetireeHeaderMatches';
import RetireeDescription from '@/components/custom/RetireeDetailsPage/RetireeDescription';
import RetireeSkillsSection from '@/components/custom/RetireeDetailsPage/RetireeSkillsSection';
import RetireeExpertiseSection from '@/components/custom/RetireeDetailsPage/RetireeExpertiseSection';
import RetireeLanguageSection from '@/components/custom/RetireeDetailsPage/RetireeLanguageSection';
import RetireeDetailsSection from '@/components/custom/RetireeDetailsPage/RetireeDetailsSection';
import RetireeWorkExperienceSection from '@/components/custom/RetireeDetailsPage/RetireeWorkExperienceSection';
import RetireeEducationSection from '@/components/custom/RetireeDetailsPage/RetireeEducationSection';

import { useRetiree } from '@/hooks/useRetiree';
import { useSkills } from '@/hooks/useSkills';
import { useExpertiseAreas } from '@/hooks/useExpertiseAreas';
import { useLanguages } from '@/hooks/useLanguages';
import { useLanguageProficiencyLevels } from '@/hooks/useLanguageProficiencyLevels';
import { getSkillName, getExpertiseName, getLanguageName, getLevelName } from './nameGetters';

interface Props {
  retireeId: string;
  startupId: string;
  jobPostingId?: string;
}

const RetireeProfileCard: React.FC<Props> = ({ retireeId }) => {
  const { retiree } = useRetiree(retireeId);
  const { skills: allSkills } = useSkills();
  const { expertiseAreas: allExpertiseAreas } = useExpertiseAreas();
  const { languages: allLanguages } = useLanguages();
  const { languageProficiencyLevels: allLevels } = useLanguageProficiencyLevels();

  if (!retiree) return null;

  return (
    <Card className="shadow-lg border-t-4 border-t-primary max-w-5xl mx-auto overflow-hidden">
      <RetireeHeaderMatches retiree={retiree} isObscured={retiree.isObscured ?? false} />

      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* left */}
          <div className="md:col-span-3">
            <RetireeDescription aboutMe={retiree.aboutMe} />

            {(retiree.skills?.length ?? 0) > 0 && (
              <RetireeSkillsSection
                skills={retiree.skills ?? []}
                getSkillName={(id) => getSkillName(id, allSkills)}
              />
            )}

            {(retiree.expertiseAreas?.length ?? 0) > 0 && (
              <RetireeExpertiseSection
                expertiseIds={retiree.expertiseAreas ?? []}
                getExpertiseName={(id) => getExpertiseName(id, allExpertiseAreas)}
              />
            )}

            {(retiree.languageProficiencies?.length ?? 0) > 0 && (
              <RetireeLanguageSection
                languageProficiencies={retiree.languageProficiencies ?? []}
                getLanguageName={(id) => getLanguageName(id, allLanguages)}
                getLevelName={(id) => getLevelName(id, allLevels)}
              />
            )}
          </div>

          {/* right */}
          <div className="md:col-span-2">
            <RetireeDetailsSection retiree={retiree} isObscured={retiree.isObscured} />
          </div>
        </div>

        {/* bottom */}
        <div className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RetireeWorkExperienceSection
              careerElements={retiree.careerElements ?? []}
              isObscured={retiree.isObscured}
            />
            <RetireeEducationSection
              careerElements={retiree.careerElements ?? []}
              isObscured={retiree.isObscured}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RetireeProfileCard;
