import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type {
  CareerElement,
  Skill,
  ExpertiseArea,
  LanguageProficiency,
} from '@/api/openapi-client/models';
import { formatDate } from '@/lib/utils';

interface CareerOverviewSectionProps {
  careerElements: CareerElement[];
  skills: Skill[];
  expertiseAreas: ExpertiseArea[];
  languageProficiencies: LanguageProficiency[];
}

const CareerOverviewSection: React.FC<CareerOverviewSectionProps> = ({
  careerElements,
  skills,
  expertiseAreas,
  languageProficiencies,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-primary">Career Overview </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Career Elements */}
        <div>
          <div className="font-semibold text-lg text-primary mb-2">Career Elements</div>
          {Array.isArray(careerElements) && careerElements.length > 0 ? (
            <ul className="space-y-4">
              {careerElements.map((entry) => (
                <li key={entry.id} className="border-l-4 pl-3 border-primary">
                  <div className="font-semibold">{entry.title}</div>
                  <div className="text-sm text-gray-500">
                    {entry.organizationName},<> {formatDate(entry.fromDate)} </>
                    {entry.untilDate && <> - {formatDate(entry.untilDate)} </>}
                  </div>
                  <div className="text-gray-700">{entry.description}</div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No career entries available.</p>
          )}
        </div>

        {/* Areas of Expertise */}
        <div>
          <div className="font-semibold text-lg text-primary mb-2">Areas of Expertise</div>
          {Array.isArray(expertiseAreas) && expertiseAreas.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {expertiseAreas.map((area) => (
                <li key={area.id} className="bg-tier-free px-3 py-1 rounded-full text-sm">
                  {area.name}
                </li>
              ))}
            </ul>
          ) : (
            <p>No areas of expertise listed.</p>
          )}
        </div>

        {/* Skills */}
        <div>
          <div className="font-semibold text-lg text-primary mb-2">Skills</div>
          {Array.isArray(skills) && skills.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <li key={skill.id} className="bg-tier-free px-3 py-1 rounded-full text-sm">
                  {skill.name}
                </li>
              ))}
            </ul>
          ) : (
            <p>No skills listed.</p>
          )}
        </div>

        {/* Language Levels */}
        <div>
          <div className="font-semibold text-lg text-primary mb-2">Language Proficiencies</div>
          {languageProficiencies.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {languageProficiencies.map((lang) => (
                <li key={lang.id} className="flex items-center gap-2">
                  <span className="bg-tier-free px-3 py-1 rounded-full text-sm">
                    {lang.languageId}: {lang.levelId}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No language proficiencies listed.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CareerOverviewSection;
