import React, { useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Helmet } from 'react-helmet-async';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import BrowseJobsResultItemCard from '@/components/custom/browse-jobs-result-item-card-';
import { useAllOpenJobPostings } from '@/hooks/useCategorizedJobPostings';
import { useSkills } from '@/hooks/useSkills';
import { useLanguages } from '@/hooks/useLanguages';
import { Label } from '@/components/ui/label';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import ProtectedRoute from '@/components/custom/ProtectedRoute';
import type { JobPosting, JobPostingSubscriptionTierEnum } from '@/api/openapi-client';
import LoadingPage from '../loading-page';

const AVAILABILITY_OPTIONS = [1, 2, 3, 4, 5];

const BrowseJobs: React.FC = () => {
  const { user: _user, loading: loadingUser } = useAuth();
  const { openJobPostings, loading, error, startupMap } = useAllOpenJobPostings();
  const { skills, loading: _loadingSkills } = useSkills();
  const { languages, loading: _loadingLanguages } = useLanguages();

  // State for Searchbar and Filter
  const [search, setSearch] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedAvailabilities, setSelectedAvailabilities] = useState<number[]>([]);
  const [salaryMin, setSalaryMin] = useState<number | undefined>(undefined);
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState<string>('');
  const [skillSearch, setSkillSearch] = useState('');
  const [languageSearch, setLanguageSearch] = useState('');

  // Multi-Select Handler
  const toggleMultiSelect = (value: string, arr: string[], setArr: (a: string[]) => void) => {
    setArr(arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]);
  };
  const toggleMultiSelectNumber = (value: number, arr: number[], setArr: (a: number[]) => void) => {
    setArr(arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]);
  };

  // Filtered Skills and Languages for Search
  const filteredSkills = useMemo(() => {
    return skills.filter((skill) => skill.name.toLowerCase().includes(skillSearch.toLowerCase()));
  }, [skills, skillSearch]);

  const filteredLanguages = useMemo(() => {
    return languages.filter((language) =>
      language.name.toLowerCase().includes(languageSearch.toLowerCase()),
    );
  }, [languages, languageSearch]);

  // Filtered jobs by all criteria
  const filteredJobs = useMemo(() => {
    let filtered = openJobPostings;
    if (search.trim() !== '') {
      filtered = filtered.filter((job) =>
        job.title.toLowerCase().includes(search.trim().toLowerCase()),
      );
    }
    if (selectedSkills.length > 0) {
      filtered = filtered.filter((job) =>
        job.matchingSkills?.some((id) => selectedSkills.includes(id)),
      );
    }
    if (selectedLanguages.length > 0) {
      filtered = filtered.filter((job) =>
        job.matchingLanguageProficiencies?.some((lp) => selectedLanguages.includes(lp.languageId)),
      );
    }
    if (selectedAvailabilities.length > 0) {
      filtered = filtered.filter((job) =>
        selectedAvailabilities.includes(job.approxDaysPerWeek ?? -1),
      );
    }
    if (salaryMin !== undefined && !isNaN(salaryMin)) {
      filtered = filtered.filter((job) => (job.approxHourlySalaryEUR ?? 0) >= salaryMin);
    }
    if (location.trim().toLowerCase() === 'remote') {
      filtered = filtered.filter(
        (job) => !job.requiredCity && !job.requiredCountry && !job.requiredZip,
      );
    } else if (location.trim() !== '') {
      filtered = filtered.filter(
        (job) =>
          //because filtering must work for both city and country
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          job.requiredCity?.toLowerCase().includes(location.trim().toLowerCase()) ||
          job.requiredCountry?.toLowerCase().includes(location.trim().toLowerCase()),
      );
    }
    if (startDate) {
      filtered = filtered.filter((job) => {
        if (!job.desiredStartDate) return false;
        return new Date(job.desiredStartDate) >= new Date(startDate);
      });
    }
    // sort jobs by their startup's subscription tier, gold first, then silver, then free
    const sortedJobs = [...filtered].sort((a: JobPosting, b: JobPosting) => {
      const getTierOrder = (tier?: JobPostingSubscriptionTierEnum) => {
        switch (tier) {
          case 'gold':
            return 2;
          case 'silver':
            return 1;
          case 'free':
            return 0;
          default:
            return 0;
        }
      };
      const tierA = getTierOrder(a.subscriptionTier);
      const tierB = getTierOrder(b.subscriptionTier);
      return tierB - tierA || a.title.localeCompare(b.title);
    });
    return sortedJobs;
  }, [
    openJobPostings,
    search,
    selectedSkills,
    selectedLanguages,
    selectedAvailabilities,
    salaryMin,
    location,
    startDate,
  ]);

  // Reset handler
  const resetFilters = () => {
    setSearch('');
    setSelectedSkills([]);
    setSelectedLanguages([]);
    setSelectedAvailabilities([]);
    setSalaryMin(undefined);
    setLocation('');
    setStartDate('');
    setSkillSearch('');
    setLanguageSearch('');
  };

  if (loadingUser || loading) return <LoadingPage />;

  return (
    <ProtectedRoute requiredUserType="Retiree">
      <div className="min-h-screen">
        <Helmet>
          <title>Browse Jobs</title>
          <meta name="description" content="Browse available jobs for retirees." />
        </Helmet>
        <div className="min-h-screen px-2 sm:px-6 lg:px-12">
          <div className="max-w-5xl mx-auto py-6 px-2 sm:px-4">
            {/* Searchbar and Reset Button in one line, Filter bar below */}
            <div className="flex flex-col gap-2 mb-4">
              <div className="flex items-center gap-3 justify-between">
                <div id="search-bar" className="relative w-full max-w-[350px]">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg
                      width="20"
                      height="20"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                      />
                    </svg>
                  </span>
                  <Input
                    placeholder="Search"
                    className="pl-10 bg-secondary/50 rounded-xl border-none shadow-none focus:ring-0"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Button
                  variant="outline"
                  className="cursor-pointer rounded-full px-6 bg-white border border-white shadow text-primary font-semibold hover:bg-white hover:border-primary hover:text-primary ml-auto"
                  onClick={resetFilters}
                  type="button"
                >
                  Reset Filters
                </Button>
              </div>
              <div className="flex flex-wrap gap-3 items-end" id="filter-section">
                {/* Filterleiste */}
                {/* Start Date */}
                <div className="flex flex-col items-start min-w-[140px] max-w-[180px]">
                  <Label className="text-xs text-gray-500 mb-1 ml-1">Start Date</Label>
                  <Popover>
                    <PopoverTrigger>
                      <Button
                        variant="outline"
                        className="rounded-full min-w-[140px] h-9 px-6 bg-white border-none shadow text-gray-400 font-semibold w-full justify-between cursor-pointer"
                      >
                        {startDate ? startDate : <span className="text-gray-400">—</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="bg-white rounded-lg shadow p-2 w-64"
                      sideOffset={5}
                      align="start"
                    >
                      <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="rounded-full px-6 bg-white border-none shadow text-gray-900 font-semibold w-full"
                        placeholder="Start Date"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Skills Multi-Select */}
                <div className="flex flex-col items-start min-w-[140px]">
                  <Label className="text-xs text-gray-500 mb-1 ml-1">Skills</Label>
                  <Popover>
                    <PopoverTrigger>
                      <Button
                        variant="outline"
                        className="rounded-full min-w-[140px] h-9 px-6 bg-white border-none shadow text-gray-900 font-semibold w-full justify-between cursor-pointer"
                      >
                        {selectedSkills.length > 0 ? (
                          (() => {
                            const firstSkill = skills.find((s) => s.id === selectedSkills[0]);
                            const firstName = firstSkill ? firstSkill.name : '';
                            return selectedSkills.length === 1
                              ? firstName
                              : `${firstName}, +${(selectedSkills.length - 1).toString()}`;
                          })()
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="bg-white rounded-lg shadow p-2 w-64"
                      sideOffset={5}
                      align="start"
                    >
                      <Input
                        placeholder="Search skills..."
                        value={skillSearch}
                        onChange={(e) => setSkillSearch(e.target.value)}
                        className="mb-2 rounded-full px-3 bg-white border-none shadow text-gray-900 font-semibold w-full h-8 text-sm"
                      />
                      {filteredSkills.map((skill) => (
                        <div key={skill.id} className="flex items-center gap-2 py-1">
                          <Checkbox
                            checked={selectedSkills.includes(skill.id)}
                            onCheckedChange={() =>
                              toggleMultiSelect(skill.id, selectedSkills, setSelectedSkills)
                            }
                            id={`skill-${skill.id}`}
                          />
                          <Label htmlFor={`skill-${skill.id}`}>{skill.name}</Label>
                        </div>
                      ))}
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Languages Multi-Select */}
                <div className="flex flex-col items-start min-w-[140px]">
                  <Label className="text-xs text-gray-500 mb-1 ml-1">Languages</Label>
                  <Popover>
                    <PopoverTrigger>
                      <Button
                        variant="outline"
                        className="rounded-full min-w-[140px] h-9 px-6 bg-white border-none shadow text-gray-900 font-semibold w-full justify-between cursor-pointer"
                      >
                        {selectedLanguages.length > 0 ? (
                          (() => {
                            const firstLang = languages.find((l) => l.id === selectedLanguages[0]);
                            const firstName = firstLang ? firstLang.name : '';
                            return selectedLanguages.length === 1
                              ? firstName
                              : `${firstName}, +${(selectedLanguages.length - 1).toString()}`;
                          })()
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="bg-white rounded-lg shadow p-2 w-64"
                      sideOffset={5}
                      align="start"
                    >
                      <Input
                        placeholder="Search languages..."
                        value={languageSearch}
                        onChange={(e) => setLanguageSearch(e.target.value)}
                        className="mb-2 rounded-full px-3 bg-white border-none shadow text-gray-900 font-semibold w-full h-8 text-sm"
                      />
                      {filteredLanguages.map((lang) => (
                        <div key={lang.id} className="flex items-center gap-2 py-1">
                          <Checkbox
                            checked={selectedLanguages.includes(lang.id)}
                            onCheckedChange={() =>
                              toggleMultiSelect(lang.id, selectedLanguages, setSelectedLanguages)
                            }
                            id={`lang-${lang.id}`}
                          />
                          <Label htmlFor={`lang-${lang.id}`}>{lang.name}</Label>
                        </div>
                      ))}
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Availability Multi-Select */}
                <div className="flex flex-col items-start min-w-[140px]">
                  <Label className="text-xs text-gray-500 mb-1 ml-1">Availability</Label>
                  <Popover>
                    <PopoverTrigger>
                      <Button
                        variant="outline"
                        className="rounded-full min-w-[140px] h-9 px-6 bg-white border-none shadow text-gray-900 font-semibold w-full justify-between cursor-pointer"
                      >
                        {selectedAvailabilities.length > 0 ? (
                          selectedAvailabilities.length
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="bg-white rounded-lg shadow p-2 w-64"
                      sideOffset={5}
                      align="start"
                    >
                      <div className="flex items-center gap-2 py-1">
                        <Checkbox
                          checked={selectedAvailabilities.length === 0}
                          onCheckedChange={() => setSelectedAvailabilities([])}
                          id="avail-all"
                        />
                        <Label htmlFor="avail-all">All</Label>
                      </div>
                      {AVAILABILITY_OPTIONS.map((days) => (
                        <div key={days} className="flex items-center gap-2 py-1">
                          <Checkbox
                            checked={selectedAvailabilities.includes(days)}
                            onCheckedChange={() =>
                              toggleMultiSelectNumber(
                                days,
                                selectedAvailabilities,
                                setSelectedAvailabilities,
                              )
                            }
                            id={`avail-${days.toString()}`}
                          />
                          <Label htmlFor={`avail-${days.toString()}`}>{days} days/w</Label>
                        </div>
                      ))}
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Salary Min */}
                <div className="flex flex-col items-start min-w-[80px] max-w-[100px]">
                  <Label className="text-xs text-gray-500 mb-1 ml-1">Min Salary</Label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={salaryMin !== undefined && !isNaN(salaryMin) ? salaryMin.toString() : ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '') {
                        setSalaryMin(undefined);
                      } else {
                        const numValue = Number(value);
                        if (!isNaN(numValue) && numValue >= 0) {
                          setSalaryMin(numValue);
                        }
                      }
                    }}
                    className="rounded-full h-9 px-3 bg-white border-none shadow text-gray-900 font-semibold w-full text-sm"
                    placeholder=""
                  />
                </div>

                {/* Location Input */}
                <div className="flex flex-col items-start min-w-[120px]">
                  <Label className="text-xs text-gray-500 mb-1 ml-1">Location</Label>
                  <Input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="rounded-full px-6 bg-white border-none shadow text-gray-900 font-semibold"
                    placeholder=""
                  />
                </div>
              </div>
            </div>

            {/* Jobpostings */}
            <div className="space-y-4" id="job-list">
              {error && <div>Error loading jobs.</div>}
              {!error && filteredJobs.length === 0 && (
                <div className="text-center py-12">
                  <div className="max-w-md mx-auto">
                    <div className="text-gray-400 mb-4">
                      <svg
                        className="w-16 h-16 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No jobs found</h3>
                    <p className="text-gray-500 text-sm mb-4">
                      Try expanding your search criteria or adjusting your filters to find more
                      opportunities.
                    </p>
                    <Button
                      variant="outline"
                      className="cursor-pointer rounded-full px-6 bg-secondary border-none shadow text-primary font-semibold hover:bg-secondary/70"
                      onClick={resetFilters}
                      type="button"
                    >
                      Clear all filters
                    </Button>
                  </div>
                </div>
              )}
              {!error &&
                filteredJobs.map((job) => {
                  const startup = startupMap[job.startupId];
                  const location =
                    !job.requiredCity && !job.requiredCountry
                      ? 'Remote'
                      : `${String(job.requiredCity ?? '')}, ${String(job.requiredCountry ?? '')}`;
                  return (
                    <a key={job.id} href={`/job/${job.id}`} className="block">
                      <BrowseJobsResultItemCard
                        job={job}
                        skills={skills}
                        languages={languages}
                        startup={startup}
                        location={location}
                      />
                    </a>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default BrowseJobs;
