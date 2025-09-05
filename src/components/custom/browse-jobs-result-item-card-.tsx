import type { JobPosting, Skill, Language } from '@/api/openapi-client';
import type { Startup } from '@/api/openapi-client/models/Startup';
import { formatDate } from '@/lib/utils';
import BrowseResultsItemCard from './browse-results-item-card';
import { SubscriptionTierBadge } from './subscription-tier-badge';

export default function BrowseJobsResultItemCard({
  job,
  skills,
  languages,
  startup,
  key,
  location,
}: {
  job: JobPosting;
  skills: Skill[];
  languages: Language[];
  startup?: Startup;
  key?: React.Key;
  location: string;
}) {
  function getSkillNames(skillIds: string[]): string[] {
    return skillIds.map((id) => {
      const skill = skills.find((s) => s.id === id);
      return skill?.name ?? id;
    });
  }

  function getLanguageNames(languageProficiencies: { languageId: string }[]): string[] {
    return languageProficiencies
      .map((lp) => {
        const language = languages.find((l) => l.id === lp.languageId);
        return language?.name ?? '';
      })
      .filter((name) => !!name);
  }

  let className = '';
  if (job.subscriptionTier === 'gold') {
    className = 'outline-3 outline-tier-gold';
  } else if (job.subscriptionTier === 'silver') {
    className = 'outline-3 outline-tier-silver';
  } else if (job.subscriptionTier === 'free') {
    className = 'outline-0 outline-tier-free';
  }

  return (
    <div className="relative">
      <div className="absolute -top-3 -right-3">
        <SubscriptionTierBadge tier={job.subscriptionTier} minimal={true} />
      </div>{' '}
      <div className="">
        <BrowseResultsItemCard
          key={key ?? ''}
          title={job.title}
          nameFirst={startup?.title ?? ''}
          imageUrl={startup?.logoUrl ?? ''}
          imageFallbackInitialsText={startup?.title ?? ''}
          secondaryTitle={startup?.title ?? ''}
          location={location}
          chips={[
            {
              title: formatDate(job.desiredStartDate),
              hoverCardHint: 'Starting Date',
            },
            ...(job.matchingSkills && job.matchingSkills.length > 0
              ? [
                  {
                    title: getSkillNames(job.matchingSkills),
                    hoverCardHint: 'Desired Skills',
                  },
                ]
              : []),
            ...(job.matchingLanguageProficiencies && job.matchingLanguageProficiencies.length > 0
              ? (() => {
                  const names = getLanguageNames(job.matchingLanguageProficiencies);
                  return names.length > 0
                    ? [
                        {
                          title: names,
                          hoverCardHint: 'Required Languages',
                        },
                      ]
                    : [];
                })()
              : []),
            {
              title: (job.approxDaysPerWeek?.toString() ?? '') + ' days/w',
              hoverCardHint: 'Days per week',
            },
            {
              title: (job.approxHourlySalaryEUR?.toString() ?? '') + ' €/h',
              hoverCardHint: 'Approx. Hourly Salary',
            },
          ]}
          href={`/job/${job.id}`}
          className={className}
        />
      </div>
    </div>
  );
}
