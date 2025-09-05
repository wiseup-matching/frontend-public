import type { Retiree } from '@/api/openapi-client/models/Retiree';
import type { Skill } from '@/api/openapi-client/models/Skill';
import type { ExpertiseArea } from '@/api/openapi-client/models/ExpertiseArea';
import type { Language } from '@/api/openapi-client/models/Language';
import BrowseResultsItemCard from './browse-results-item-card';
import React from 'react';
import { getProfileImageUrl, getNameDisplay } from './profileBlurringUtils';

export default function BrowseRetireesResultItemCard({
  retiree,
  skills,
  languages,
  expertiseAreas,
  getMostRecentCareerElement,
  key,
}: {
  retiree: Retiree;
  skills: Skill[];
  languages: Language[];
  expertiseAreas: ExpertiseArea[];
  getMostRecentCareerElement: (careerElements?: any[]) => any;
  key?: React.Key;
}) {
  function getExpertiseNames(expertiseIds?: string[]): string[] {
    if (!expertiseIds) return [];
    return expertiseIds.map((id) => {
      const expertise = expertiseAreas.find((e) => e.id === id);
      return expertise ? expertise.name : id;
    });
  }
  function getSkillNames(skillIds?: string[]): string[] {
    if (!skillIds) return [];
    return skillIds.map((id) => {
      const skill = skills.find((s) => s.id === id);
      return skill?.name ?? id;
    });
  }

  function getLanguageNames(languageProficiencies?: { languageId: string }[]): string[] {
    if (!languageProficiencies) return [];
    return languageProficiencies
      .map((lp) => {
        const language = languages.find((l) => l.id === lp.languageId);
        return language?.name ?? '';
      })
      .filter((name) => !!name);
  }

  const mostRecentCareerElement = getMostRecentCareerElement(retiree.careerElements);

  // Get name display element using the utility function
  const nameDisplay = getNameDisplay(retiree.nameFirst, retiree.nameLast, !!retiree.isObscured);

  const locationDisplay =
    [retiree.addressCity, retiree.addressCountry].filter(Boolean).join(', ') ||
    'Location not provided';

  // Get image URL using the utility function
  const imageUrl = getProfileImageUrl(retiree.profilePicture, retiree.id, !!retiree.isObscured);

  return BrowseResultsItemCard({
    key: key ?? '',
    title: mostRecentCareerElement?.title ?? '—',
    nameFirst: retiree.nameFirst,
    imageUrl,
    secondaryTitle: nameDisplay,
    location: locationDisplay,
    chips: [
      ...(retiree.skills && retiree.skills.length > 0
        ? [
            {
              title: getSkillNames(retiree.skills),
              hoverCardHint: 'Skills',
            },
          ]
        : []),
      ...(retiree.expertiseAreas && retiree.expertiseAreas.length > 0
        ? [
            {
              title: getExpertiseNames(retiree.expertiseAreas),
              hoverCardHint: 'Expertise Areas',
            },
          ]
        : []),
      ...(retiree.languageProficiencies && retiree.languageProficiencies.length > 0
        ? (() => {
            const names = getLanguageNames(retiree.languageProficiencies);
            return names.length > 0
              ? [
                  {
                    title: names,
                    hoverCardHint: 'Languages',
                  },
                ]
              : [];
          })()
        : []),
      ...(retiree.desiredWorkHoursPerWeek
        ? [
            {
              title: retiree.desiredWorkHoursPerWeek.toString() + ' hours/w',
              hoverCardHint: 'Availability',
            },
          ]
        : []),
      ...(retiree.expectedHourlySalaryEUR
        ? [
            {
              title: retiree.expectedHourlySalaryEUR.toString() + ' €/h',
              hoverCardHint: 'Expected Hourly Salary',
            },
          ]
        : []),
    ],
    href: `/retiree/public/${retiree.id}`,
  });
}
